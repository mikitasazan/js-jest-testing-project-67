import { readFile, mkdtemp } from 'node:fs/promises';
import nock from 'nock';
import path from 'path';
import os from 'os';
import { pageLoader } from '../src/page-loader';
import { getDirname } from '../src/helpers/get-dirname';

let htmlFile = null;
let dirPath = null;

describe('check load image', () => {
  beforeAll(async () => {
    const bufferFile = await readFile(
      getDirname('../../__fixtures__/html-with-image.html'),
      { encoding: 'utf-8' }
    );

    htmlFile = bufferFile;
  });
  beforeEach(async () => {
    dirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  it('Корректное скачивание страницы с картинкой', async () => {
    nock('https://ru.hexlet.io')
      .get('/professions/nodejs')
      .reply(200, htmlFile);

    await pageLoader('https://ru.hexlet.io/professions/nodejs', dirPath);

    const file = await readFile(
      `${dirPath}/ru-hexlet-io-professions-nodejs.html`,
      { encoding: 'utf8' }
    );

    expect(file).toBe(htmlFile);
  });
});
