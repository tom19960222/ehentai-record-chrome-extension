import { ReadEvent, ServerRequestAction, ViewerTypeEnum } from './ServerRequestAction';
import { GalleryInfo } from './content';

export class mpvPageReadTracker {
  serverRequestAction: ServerRequestAction;
  galleryInfo: GalleryInfo;

  constructor({ serverRequestAction, galleryInfo }: { serverRequestAction: ServerRequestAction, galleryInfo: GalleryInfo }){
    this.serverRequestAction = serverRequestAction;
    this.galleryInfo = galleryInfo;
    const self = this;

    const readPages = new Set(); 
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    
    const elementList = document.querySelectorAll('.mi0');
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {console.log(mutation);
        if (mutation.type === "attributes") {
          if(mutation.target.style.visibility === 'hidden') return;
          const matchResult = mutation.target.id.match(/image_([0-9]+)/);
          if(matchResult.length > 1){
            if(!(readPages.has(matchResult[1]))) {
              readPages.add(matchResult[1]);
              console.log(`You are reading page ${matchResult[1]}`);
              self.serverRequestAction.sendEventToServer(new ReadEvent({
                viewer_type: ViewerTypeEnum.MultiPageViewer,
                gid: galleryInfo.galleryId,
                page_number: parseInt(matchResult[1])
              }));
            }
          }
        }
      });
    });
    
    for(const element of elementList){
      observer.observe(element, {
        attributes: true //configure it to listen to attribute changes
      });
    }
  }
}

export default mpvPageReadTracker;