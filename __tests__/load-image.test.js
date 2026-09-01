import { readFile, mkdtemp } from 'node:fs/promises';
import nock from 'nock';
import path from 'path';
import os from 'os';
import { pageLoader } from '../src/page-loader';
import { getDirname } from '../src/helpers/get-dirname';

let dirPath = null;

describe('check load image', () => {
  beforeEach(async () => {
    dirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  it('Корректное скачивание картинки (site.com, https)', async () => {
    const input = await readFile(
      getDirname('../../__fixtures__/site-com-blog-about.html'),
      { encoding: 'utf-8' }
    );
    const filesDir = getDirname(
      '../../__fixtures__/expected/site-com-blog-about_files'
    );
    const expectedImage = await readFile(
      `${filesDir}/site-com-photos-me.jpg`
    );

    nock('https://site.com')
      .get('/blog/about')
      .twice()
      .reply(200, input)
      .get('/blog/about/assets/styles.css')
      .reply(
        200,
        await readFile(`${filesDir}/site-com-blog-about-assets-styles.css`)
      )
      .get('/photos/me.jpg')
      .reply(200, expectedImage)
      .get('/assets/scripts.js')
      .reply(200, await readFile(`${filesDir}/site-com-assets-scripts.js`));

    await pageLoader('https://site.com/blog/about', dirPath);

    const gotImage = await readFile(
      `${dirPath}/site-com-blog-about_files/site-com-photos-me.jpg`
    );

    // Binary-safe: the downloaded image is byte-identical to the source,
    // not just present.
    expect(Buffer.compare(gotImage, expectedImage)).toBe(0);

    const gotHtml = await readFile(`${dirPath}/site-com-blog-about.html`, {
      encoding: 'utf8',
    });
    expect(gotHtml).toContain(
      'src="site-com-blog-about_files/site-com-photos-me.jpg"'
    );
  });
});
