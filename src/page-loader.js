import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';

import { getFileName } from './helpers/get-file-name.js';

export const pageLoader = async (url, output) => {
  const { data, status } = await axios(url);

  if (status !== 200) {
    throw new Error('Что-то пошло не так c запросом');
  }

  const $ = cheerio.load(data);

  const srcImages = [];
  $('img').each((_, element) => {
    const src = $(element).attr('src');
    srcImages.push(src);
  });

  const pngAndJpgImages = srcImages.filter((src) => {
    const elements = src.split('.');
    const extension = elements[elements.length - 1];
    console.log(elements);
    return extension === 'png' || extension === 'jpg';
  });

  const images = await Promise.all(
    srcImages.map((src) => axios(src, { responseType: 'blob' }))
  );

  const fileName = `${getFileName(url)}.html`;
  const dirname = output ?? process.cwd();

  const filePath = `${dirname}/${fileName}`;

  return writeFile(filePath, data);
};
