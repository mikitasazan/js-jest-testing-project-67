import { readFile, mkdtemp } from 'node:fs/promises';
import nock from 'nock';
import path from 'path';
import os from 'os';
import { pageLoader } from '../page-loader';
import { getDirname } from '../helpers/get-dirname';

let htmlFile = null;
let dirPath = null;

describe(pageLoader, () => {
  beforeAll(async () => {
    const bufferFile = await readFile(
      getDirname('../__fixtures__/hexlet-template.html'),
      { encoding: 'utf-8' }
    );

    htmlFile = bufferFile;
  });
  beforeEach(async () => {
    dirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  it('Скачивание файла', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, htmlFile?.toString());

    await pageLoader('https://ru.hexlet.io/courses', dirPath);

    const file = await readFile(`${dirPath}/ru-hexlet-io-courses.html`, {
      encoding: 'utf8',
    });

    expect(file).toBe(htmlFile);
  });
  it('Передача некорректного пути', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(500);

    return expect(
      pageLoader('https://ru.hexlet.io/courses', dirPath)
    ).rejects.toThrow();
  });
  it('Передача некорректной директории', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, htmlFile?.toString());

    return expect(
      pageLoader('https://ru.hexlet.io/courses', 'directory')
    ).rejects.toThrow();
  });
});
