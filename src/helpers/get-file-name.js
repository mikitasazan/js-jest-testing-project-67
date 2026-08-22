export const getFileName = (url) => {
  if (typeof url !== 'string') return null;

  const [_protocol, urlWithoutProtocol] = url.split('https://');

  return urlWithoutProtocol.replace(/[^a-zA-Z0-9]/g, '-');
};
