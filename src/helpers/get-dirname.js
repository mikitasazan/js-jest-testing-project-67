import path from 'path';

export const getDirname = (filePath) =>
  `${path.dirname(new URL(import.meta.url).pathname)}/${filePath}`;
