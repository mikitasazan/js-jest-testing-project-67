import { readFile, mkdtemp } from 'node:fs/promises';
import nock from 'nock';
import path from 'path';
import os from 'os';
import { pageLoader } from '../src/page-loader';
import { getDirname } from '../src/helpers/get-dirname';

let dirPath = null;

describe(pageLoader, () => {
  beforeEach(async () => {
    dirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  it('Скачивание страницы и локальных ресурсов (localhost, http)', async () => {
    const input = await readFile(
      getDirname('../../__fixtures__/localhost-blog-about.html'),
      { encoding: 'utf-8' }
    );
    const expectedHtml = await readFile(
      getDirname('../../__fixtures__/expected/localhost-blog-about.html'),
      { encoding: 'utf-8' }
    );
    const filesDir = getDirname(
      '../../__fixtures__/expected/localhost-blog-about_files'
    );

    nock('http://localhost')
      .get('/blog/about')
      .twice()
      .reply(200, input)
      .get('/blog/about/assets/styles.css')
      .reply(
        200,
        await readFile(`${filesDir}/localhost-blog-about-assets-styles.css`)
      )
      .get('/photos/me.jpg')
      .reply(200, await readFile(`${filesDir}/localhost-photos-me.jpg`))
      .get('/assets/scripts.js')
      .reply(200, await readFile(`${filesDir}/localhost-assets-scripts.js`));

    await pageLoader('http://localhost/blog/about', dirPath);

    const gotHtml = await readFile(`${dirPath}/localhost-blog-about.html`, {
      encoding: 'utf8',
    });
    expect(gotHtml).toBe(expectedHtml);

    const gotCss = await readFile(
      `${dirPath}/localhost-blog-about_files/localhost-blog-about-assets-styles.css`
    );
    const expectedCss = await readFile(
      `${filesDir}/localhost-blog-about-assets-styles.css`
    );
    expect(Buffer.compare(gotCss, expectedCss)).toBe(0);
  });

  it('Передача некорректного пути', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(500);

    return expect(
      pageLoader('https://ru.hexlet.io/courses', dirPath)
    ).rejects.toThrow();
  });

  it('Передача некорректной директории', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(200, '<html></html>');

    return expect(
      pageLoader('https://ru.hexlet.io/courses', 'directory-does-not-exist')
    ).rejects.toThrow();
  });
});
