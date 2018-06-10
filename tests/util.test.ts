import { extractURLInformation } from "../src/util";

test('Can extract information in gallery URL', () => {
  const info = extractURLInformation('https://exhentai.org/g/1236090/1e57b4def9/');
  expect(info).toEqual({
    position: 'gallery',
    galleryId: 1236090,
    galleryToken: '1e57b4def9',
    site: 'exhentai',
    page: null
  });
});

test('Can extract information in multi page viewer URL', () => {
  const info = extractURLInformation('https://exhentai.org/mpv/1236090/1e57b4def9');
  expect(info).toEqual({
    position: 'mpv',
    galleryId: 1236090,
    galleryToken: '1e57b4def9',
    site: 'exhentai',
    page: null
  });
});

test('Can extract information in single page viewer URL', () => {
  const info = extractURLInformation('https://e-hentai.org/s/e73e7138f3/1236080-3');
  expect(info).toEqual({
    position: 'single',
    galleryId: 1236080,
    galleryToken: 'e73e7138f3',
    site: 'e-hentai',
    page: 3
  });
});