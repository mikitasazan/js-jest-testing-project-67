import axios from 'axios';
import { writeFile, mkdir } from 'node:fs/promises';
import * as cheerio from 'cheerio';

import { getFileName } from './helpers/get-file-name.js';

// Attributes that reference a downloadable local resource.
const RESOURCE_ATTRS = [
  { selector: 'img', attr: 'src' },
  { selector: 'link', attr: 'href' },
  { selector: 'script', attr: 'src' },
];

const isSameHost = (resourceUrl, pageUrl) =>
  resourceUrl.hostname === pageUrl.hostname;

export const pageLoader = async (url, output) => {
  const pageUrl = new URL(url);
  const { data, status } = await axios(url);

  if (status !== 200) {
    throw new Error('Что-то пошло не так c запросом');
  }

  const dirname = output ?? process.cwd();
  const pageFileName = getFileName(url);
  const filesDirName = `${pageFileName.replace(/\.html$/, '')}_files`;
  const filesDirPath = `${dirname}/${filesDirName}`;

  const $ = cheerio.load(data);
  const resources = [];

  RESOURCE_ATTRS.forEach(({ selector, attr }) => {
    $(selector).each((_, element) => {
      const value = $(element).attr(attr);
      if (!value) return;

      let resourceUrl;
      try {
        resourceUrl = new URL(value, pageUrl);
      } catch {
        return;
      }

      if (!isSameHost(resourceUrl, pageUrl)) return;

      const resourceFileName = getFileName(resourceUrl.href);
      $(element).attr(attr, `${filesDirName}/${resourceFileName}`);
      resources.push({ href: resourceUrl.href, fileName: resourceFileName });
    });
  });

  if (resources.length > 0) {
    await mkdir(filesDirPath, { recursive: true });
    await Promise.all(
      resources.map(async ({ href, fileName }) => {
        const response = await axios(href, { responseType: 'arraybuffer' });
        return writeFile(`${filesDirPath}/${fileName}`, response.data);
      })
    );
  }

  const filePath = `${dirname}/${pageFileName}`;

  return writeFile(filePath, `${$.html()}\n`);
};
