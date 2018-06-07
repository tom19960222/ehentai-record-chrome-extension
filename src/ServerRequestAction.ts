class Metadata {
  archiver_key: string;
  category: string;
  expunged: boolean;
  filecount: string;
  filesize: number;
  gid: number;
  posted: string;
  rating: string;
  tags: string[];
  thumb: string;
  title: string;
  title_jpn: string;
  token: string;
  torrentcount: string;
  uploader: string;

  constructor (data: object){
    Object.assign(this, data);
  }
}

class MetadataServerRequest {
  metadata: Metadata;
  user: string;
  time: number;

  constructor (data: any) {
    this.metadata = data.metadata;
    this.user = data.user;
    this.time = data.time;
  }
}

enum PageTypeEnum {
  BookList = 'book_list',
  BookDetail = 'book_detail',
  BookSingleImagePage = 'book_single_image_page',
  MultiPageViewer = 'multi_page_viewer'
}

class EventServerRequest {
  page_type: PageTypeEnum;
  gid: number;
  page_number: number | null;
  time: number;
}

export class ServerRequestAction {
  private parseResponse (resp: string) : Metadata {
    let metadata = JSON.parse(resp);
    metadata = metadata.gmetadata[0];
    return metadata;
  }

  queryMetadataFromEHentaiAPIServer = (apiService: string, galleryId: string, galleryToken: string) : Promise<Metadata> => {
    return new Promise((resolve, reject) => {
      const self = this;
      const EHapiRequest = new XMLHttpRequest();
      const data = {
        'method': 'gdata',
        'gidlist': [
            [galleryId, galleryToken]
        ],
        'namespace': 1
      }
      const apiUrl = apiService === 'exhentai' ? 'https://exhentai.org/api.php' : 'https://api.e-hentai.org/api.php'
    
      EHapiRequest.open('POST', apiUrl, true);
      EHapiRequest.setRequestHeader("Content-type", "application/json"); 
      EHapiRequest.onreadystatechange = function() { // Call a function when the state changes.
        if(EHapiRequest.readyState === 4 && EHapiRequest.status === 200) {
          const metadata = self.parseResponse(EHapiRequest.responseText);
          return resolve(metadata);
        }
      }
      EHapiRequest.send(JSON.stringify(data));
    })
  }

  sendMetadataToServer = (metadata: object) : Promise<undefined> => {
    const SERVER_URL = 'https://eh-record.hsexpert.net/record';
  
    return new Promise((resolve, reject) => {
      const serverApiRequest = new XMLHttpRequest();
      const recordData = new MetadataServerRequest({
        metadata: metadata,
        user: 'tom19960222@gmail.com',
        time: (new Date().valueOf() / 1000)
      });
      serverApiRequest.open('POST', SERVER_URL, true);
      serverApiRequest.setRequestHeader('Content-type', 'application/json');
      serverApiRequest.onreadystatechange = function() {
        if(serverApiRequest.readyState === XMLHttpRequest.DONE && serverApiRequest.status == 201){
          console.log('Send record done.');
          return resolve();
        }
      }
      serverApiRequest.send(JSON.stringify(recordData));
    })
  }
}