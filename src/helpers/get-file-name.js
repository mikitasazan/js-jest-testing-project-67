import path from 'node:path';

// Derives the local filename Hexlet's page-loader uses for a URL:
// host + path, every non-alphanumeric character turned into a dash,
// keeping the resource's own extension (defaulting to .html when the
// URL has none, e.g. the page itself).
export const getFileName = (url) => {
  if (typeof url !== 'string') return null;

  const { hostname, pathname: rawPathname } = new URL(url);
  const pathname = rawPathname === '/' ? '' : rawPathname;
  const ext = path.extname(pathname) || '.html';
  const pathWithoutExt = path.extname(pathname)
    ? pathname.slice(0, -ext.length)
    : pathname;

  const slug = `${hostname}${pathWithoutExt}`.replace(/[^a-zA-Z0-9]/g, '-');

  return `${slug}${ext}`;
};
