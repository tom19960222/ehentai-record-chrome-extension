import { ServerRequestAction } from '../src/ServerRequestAction';
import { mpvPageReadTracker } from '../src/mpvPageReadTracker';
import { Main } from '../src/content';

let mockQueryMetadataFromEHentaiAPIServer = jest.fn();
let mockSendMetadataToServer = jest.fn();
jest.mock('../src/ServerRequestAction', () => {
  return {
    ServerRequestAction: jest.fn().mockImplementation(() => {
      return {
        queryMetadataFromEHentaiAPIServer: mockQueryMetadataFromEHentaiAPIServer,
        sendMetadataToServer: mockSendMetadataToServer,
        sendEventToServer: jest.fn()
      }
    })
  }
});
// jest.mock('../src/ServerRequestAction');
jest.mock('../src/mpvPageReadTracker');

beforeEach(() => {
  mockQueryMetadataFromEHentaiAPIServer.mockClear();
  mockSendMetadataToServer.mockClear();
  // ServerRequestAction.mockClear();
  mpvPageReadTracker.mockClear();
});

test('main function should do nothing in other sites', async () => {
  const mockDocument = new Document();
  Object.defineProperty(mockDocument, 'URL', {
    configurable: true,
    value: 'https://www.google.com/'
  });

  await new Main(mockDocument).start();

  expect(mpvPageReadTracker).not.toBeCalled();
  expect(mockQueryMetadataFromEHentaiAPIServer).not.toBeCalled();
  expect(mockSendMetadataToServer).not.toBeCalled();
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