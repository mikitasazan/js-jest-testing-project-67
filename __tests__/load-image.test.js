let htmlFile = null;
let dirPath = null;

describe('check load image', () => {
  beforeAll(async () => {
    const bufferFile = await readFile(
      getDirname('../__fixtures__/html-with-image.html'),
      { encoding: 'utf-8' }
    );

    htmlFile = bufferFile;
  });
  beforeEach(async () => {
    dirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  it('Корректное скачивание картинок', () => {});
});
