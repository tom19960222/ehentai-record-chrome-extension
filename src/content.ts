// console.log(document.URL);
import { ServerRequestAction, ReadEvent, ViewerTypeEnum } from "./ServerRequestAction";
import { mpvPageReadTracker } from "./mpvPageReadTracker";
import { singlePageReadTracker } from "./singlePageReadTracker";
import { RecommandGenerator } from "./recommandGenerator";
import { extractURLInformation } from './util';
import { Position } from "./model";

export class Main {
  private document: Document;
  private serverRequestAction: ServerRequestAction;

  constructor(document: Document) {
    this.document = document;
    this.serverRequestAction = new ServerRequestAction();
  }

  async start() {
    console.log("document.URL", this.document.URL);
    const urlInfo = extractURLInformation(this.document.URL);
    if (!urlInfo){
      // Not in target website.
      return;
    }

    console.log('Position:', urlInfo.position);

    switch (urlInfo.position) {
      case Position.gallery:
        console.log(
          `Gallery_id=${urlInfo.galleryId}, Gallery_token=${
            urlInfo.galleryToken
          }`
        );
        const metadata = await this.serverRequestAction.queryMetadataFromEHentaiAPIServer(
          urlInfo.site,
          urlInfo.galleryId,
          urlInfo.galleryToken
        );
        await this.serverRequestAction.sendMetadataToServer(metadata);
        await this.serverRequestAction.sendEventToServer(new ReadEvent({
          viewer_type: ViewerTypeEnum.BookDetail,
          gid: urlInfo.galleryId,
          page_number: urlInfo.page
        }));
        break;
      
      case Position.single:
        await this.serverRequestAction.sendEventToServer(new ReadEvent({
          viewer_type: ViewerTypeEnum.BookSingleImagePage,
          gid: urlInfo.galleryId,
          page_number: urlInfo.page
        }));
        new singlePageReadTracker({ serverRequestAction: this.serverRequestAction, galleryInfo: urlInfo });
        break;
      case Position.mpv:
        new mpvPageReadTracker({ serverRequestAction: this.serverRequestAction, galleryInfo: urlInfo });
        break;
      case Position.search:
        new RecommandGenerator();
        break;
    }
  }
}

new Main(window.document).start().then(() => {});
