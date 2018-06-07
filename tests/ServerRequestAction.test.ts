import { ServerRequestAction } from '../src/ServerRequestAction';
import { newMockXhr } from 'mock-xmlhttprequest';

let serverRequestActionInstance : ServerRequestAction;
let MockXMLHttpRequest: any;

const createXHRmock = () => {
  const mockObj = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    mockRequestFinished: function() {
      if(!this.onreadystatechange) throw new Error('No onreadystatechange function!');
      this.readyState = 4; // XMLHttpRequest.DONE
      this.status = 200;
      this.responseText = '';
      this.onreadystatechange();
    }
  };

  const xhrMockClass = function () {
    const self = this;
      return {
        open: mockObj.open,
        send: mockObj.send,
        setRequestHeader: mockObj.setRequestHeader,
        mockRequestFinished: mockObj.mockRequestFinished.bind(self)
      };
  };

  window.XMLHttpRequest = jest.fn(xhrMockClass);
  return mockObj;
}

beforeEach(() => {
  serverRequestActionInstance = new ServerRequestAction();
  MockXMLHttpRequest = newMockXhr();
  global.XMLHttpRequest = MockXMLHttpRequest;
});

test('Get metadata from server', async () => {
  MockXMLHttpRequest.onSend = function(xhr) {
    const response = `{"gmetadata":[{"gid":1217029,"token":"ba12731380","archiver_key":"423593--b00a566a8b16ab04b1fdab24ef600ff5510a5bb8","title":"[Anthology] Kono Haru, Kanojo to Issho ni Sotsugyou Shimashita ~Sensei x JK Kindan H Hen~ [Digital]","title_jpn":"[\u30a2\u30f3\u30bd\u30ed\u30b8\u30fc] \u3053\u306e\u6625\u3001\u5f7c\u5973\u3068\u4e00\u7dd2\u306b\u5352\u696d\u3057\u307e\u3057\u305f \uff5e\u5148\u751f\u00d7JK\u7981\u65adH\u7de8\uff5e [DL\u7248]","category":"Manga","thumb":"https:\/\/exhentai.org\/t\/5b\/d9\/5bd9bc5a1ec890d76f984f55ce714cabec20efef-236092-1057-1500-jpg_l.jpg","uploader":"DarkMGA","posted":"1524906592","filecount":"132","filesize":59991247,"expunged":false,"rating":"4.43","torrentcount":"2","tags":["artist:harukichi","artist:ichiko","artist:izumiya otoha","artist:samidare setsuna","artist:tachibana yuu","male:glasses","male:schoolboy uniform","female:big breasts","female:blowjob","female:paizuri","female:pantyhose","female:schoolgirl uniform","female:twintails","anthology"]}]}`;
    const responseHeaders = {
      'Content-Type': 'application/json',
    }
    console.log('ready to respond!');
    xhr.respond(200, responseHeaders, response);
  };
  
  const result = await serverRequestActionInstance.queryMetadataFromEHentaiAPIServer('exhentai', '1217029', 'ba12731380');

  expect(result).toBeDefined();
  expect(result.gid).toBe(1217029);
  expect(result.token).toBe('ba12731380');
  expect(result.title).toBe('[Anthology] Kono Haru, Kanojo to Issho ni Sotsugyou Shimashita ~Sensei x JK Kindan H Hen~ [Digital]');
})

test('Send metadata to server', async () => {
  const metadata = {
    "gid": 1217029,
    "token": "ba12731380",
    "archiver_key": "423593--b00a566a8b16ab04b1fdab24ef600ff5510a5bb8",
    "title": "[Anthology] Kono Haru, Kanojo to Issho ni Sotsugyou Shimashita ~Sensei x JK Kindan H Hen~ [Digital]",
    "title_jpn": "[アンソロジー] この春、彼女と一緒に卒業しました ～先生×JK禁断H編～ [DL版]",
    "category": "Manga",
    "thumb": "https:\/\/exhentai.org\/t\/5b\/d9\/5bd9bc5a1ec890d76f984f55ce714cabec20efef-236092-1057-1500-jpg_l.jpg",
    "uploader": "DarkMGA",
    "posted": "1524906592",
    "filecount": "132",
    "filesize": 59991247,
    "expunged": false,
    "rating": "4.43",
    "torrentcount": "2",
    "tags": [
      "artist:harukichi",
      "artist:ichiko",
      "artist:izumiya otoha",
      "artist:samidare setsuna",
      "artist:tachibana yuu",
      "male:glasses",
      "male:schoolboy uniform",
      "female:big breasts",
      "female:blowjob",
      "female:paizuri",
      "female:pantyhose",
      "female:schoolgirl uniform",
      "female:twintails",
      "anthology"
    ]
  }
  
})