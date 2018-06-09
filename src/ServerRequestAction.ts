import axios from 'axios';

export class Metadata {
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

export class MetadataServerRequest {
  metadata: Metadata;
  user: string;
  time: number;

  constructor (data: any) {
    this.metadata = data.metadata;
    this.user = data.user;
    this.time = Math.trunc(new Date().valueOf() / 1000);
  }
}

export enum ViewerTypeEnum {
  BookList = 'book_list',
  BookDetail = 'book_detail',
  BookSingleImagePage = 'book_single_image_page',
  MultiPageViewer = 'multi_page_viewer'
}

export class ReadEvent {
  viewer_type: ViewerTypeEnum;
  gid: number;
  page_number: number | null;
  time: number;

  constructor({viewer_type, gid, page_number}: {viewer_type: ViewerTypeEnum, gid: number, page_number: number}){
    this.viewer_type = viewer_type;
    this.gid = gid;
    this.page_number = page_number;
    this.time = Math.trunc(new Date().valueOf() / 1000)
  }
}

export class EventServerRequest {
  event: ReadEvent;
  user: string;

  constructor({event, user}: {event: ReadEvent, user: string}){
    this.event = event;
    this.user = user;
  }
}

export class ServerRequestAction {
  private parseResponse (resp: string) : Metadata {
    let metadata = JSON.parse(resp);
    metadata = metadata.gmetadata[0];
    return metadata;
  }

  queryMetadataFromEHentaiAPIServer = async (apiService: string, galleryId: string, galleryToken: string) : Promise<Metadata> => {
    const data = {
      'method': 'gdata',
      'gidlist': [
          [galleryId, galleryToken]
      ],
      'namespace': 1
    }
    const apiUrl = apiService === 'exhentai' ? 'https://exhentai.org/api.php' : 'https://api.e-hentai.org/api.php';
    const headers = {'Content-Type': 'application/json'};
    const response = await axios.post(apiUrl, data, { headers });
    console.log('response', response);
    return new Metadata(response.data.gmetadata[0]);
  }

  sendMetadataToServer = async (metadata: Metadata) : Promise<MetadataServerRequest> => {
    const SERVER_URL = 'https://eh-record.hsexpert.net/record';
    const data = new MetadataServerRequest({
      metadata: metadata,
      user: 'tom19960222@gmail.com',
    });
    const headers = {'Content-Type': 'application/json'};
    const response = await axios.post(SERVER_URL, data, { headers });
    return new MetadataServerRequest(response.data);
  }

  sendEventToServer = async (event: ReadEvent): Promise<EventServerRequest> => {
    const SERVER_URL = 'https://eh-record.hsexpert.net/event';
    const data = new EventServerRequest({
      event,
      user: 'tom19960222@gmail.com'
    });
    const headers = {'Content-Type': 'application/json'};
    const response = await axios.post(SERVER_URL, data, { headers });
    return new EventServerRequest(response.data);
  }
}