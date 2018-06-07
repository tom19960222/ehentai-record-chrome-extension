import { ServerRequestAction } from '../src/ServerRequestAction';
import { mpvPageReadTracker } from '../src/mpvPageReadTracker';
import { Main } from '../src/content';

jest.mock('../src/ServerRequestAction', () => {
  return {
    ServerRequestAction: jest.fn().mockImplementation(() => {
      return {
        queryMetadataFromEHentaiAPIServer: jest.fn(),
        sendMetadataToServer: jest.fn()
      }
    })
  }
});
jest.mock('../src/mpvPageReadTracker');

beforeEach(() => {
  ServerRequestAction.mockClear();
  mpvPageReadTracker.mockClear();
});

test('main function should no nothing in other sites', async () => {
  const mockDocument = new Document();
  Object.defineProperty(mockDocument, 'URL', {
    configurable: true,
    value: 'https://www.google.com/'
  });

  await new Main(mockDocument).start();

  expect(ServerRequestAction).not.toBeCalled();
  expect(mpvPageReadTracker).not.toBeCalled();
});

test('main function should query and send metadata in book detail page', async () => {
  const mockDocument = new Document();
  Object.defineProperty(mockDocument, 'URL', {
    configurable: true,
    value: 'https://exhentai.org/g/1217177/b51106d04c/'
  });

  await new Main(mockDocument).start();

  expect(ServerRequestAction).toBeCalled();
  expect(mpvPageReadTracker).not.toBeCalled();
})

test('Can extract information in gallery URL', () => {
  const main = new Main(new Document());

  const info = main.extractURLInformation('https://exhentai.org/g/1236090/1e57b4def9/');
  expect(info).toEqual({
    position: 'gallery',
    galleryId: '1236090',
    galleryToken: '1e57b4def9',
    site: 'exhentai'
  });
});

test('Can extract information in multi page viewer URL', () => {
  const main = new Main(new Document());

  const info = main.extractURLInformation('https://exhentai.org/mpv/1236090/1e57b4def9');
  expect(info).toEqual({
    position: 'mpv',
    galleryId: '1236090',
    galleryToken: '1e57b4def9',
    site: 'exhentai'
  });
});

test('Can extract information in single page viewer URL', () => {
  const main = new Main(new Document());

  const info = main.extractURLInformation('https://e-hentai.org/s/e73e7138f3/1236080-3');
  expect(info).toEqual({
    position: 'single',
    galleryId: '1236080',
    galleryToken: 'e73e7138f3',
    site: 'e-hentai',
    page: 3
  });
});