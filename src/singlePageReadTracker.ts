import { ReadEvent, ServerRequestAction, ViewerTypeEnum } from './ServerRequestAction';
import { GalleryInfo } from './model';
import { extractURLInformation } from './util';

export class singlePageReadTracker {
  serverRequestAction: ServerRequestAction;
  galleryInfo: GalleryInfo;

  constructor({ serverRequestAction, galleryInfo }: { serverRequestAction: ServerRequestAction, galleryInfo: GalleryInfo }){
    this.serverRequestAction = serverRequestAction;
    this.galleryInfo = galleryInfo;
    const self = this;

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    
    const element = document.getElementById('i3');
    
    const observer = new MutationObserver(async function(mutations) {
      if(mutations.length <= 0) return;
      const mutation = mutations[0];
      const URLNow = mutation.target.baseURI;
      const URLNowInfo = extractURLInformation(URLNow);
      await self.serverRequestAction.sendEventToServer(new ReadEvent({
        viewer_type: ViewerTypeEnum.BookSingleImagePage,
        gid: URLNowInfo.galleryId,
        page_number: URLNowInfo.page
      }));
    });
    
    observer.observe(element, {
      attributes: true, //configure it to listen to attribute changes
      subtree: true,
    });
  }
}

export default singlePageReadTracker;