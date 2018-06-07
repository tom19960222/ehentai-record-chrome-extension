// console.log(document.URL);
import { ServerRequestAction } from './ServerRequestAction';
import { mpvPageReadTracker } from './mpvPageReadTracker';

export class Main {
  private document: Document; 
  
  constructor (document: Document) {
    this.document = document;
  }

  extractURLInformation(URL: string) {
    const galleryMatch = URL.match(/https:\/\/(exhentai|e-hentai).org\/g\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
    const mpvPageMatch = URL.match(/https:\/\/(exhentai|e-hentai).org\/mpv\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/);
    const singlePageMatch = URL.match(/https:\/\/(exhentai|e-hentai).org\/s\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)-([0-9]+)\/?/);
    if (galleryMatch && galleryMatch.length === 4) 
      return {
        position: 'gallery',
        galleryId: galleryMatch[2],
        galleryToken: galleryMatch[3],
        site: galleryMatch[1],
      };
    if (mpvPageMatch && mpvPageMatch.length === 4) 
      return {
        position: 'mpv',
        galleryId: mpvPageMatch[2],
        galleryToken: mpvPageMatch[3],
        site: mpvPageMatch[1],
      };
    if (singlePageMatch && singlePageMatch.length === 5) 
      return {
        position: 'single',
        galleryId: singlePageMatch[3],
        galleryToken: singlePageMatch[2],
        site: singlePageMatch[1],
        page: parseInt(singlePageMatch[4])
      };
  }

  async start() {
    console.log('document.URL', this.document.URL);
    const urlInfo = this.extractURLInformation(this.document.URL);

    if(!urlInfo) // Not in target website.
      return;

    switch(urlInfo.position){
      case 'gallery':
        const serverRequest = new ServerRequestAction();
        console.log(`Gallery_id=${urlInfo.galleryId}, Gallery_token=${urlInfo.galleryToken}`);
        const metadata = await serverRequest.queryMetadataFromEHentaiAPIServer(urlInfo.site, urlInfo.galleryId, urlInfo.galleryToken);
        await serverRequest.sendMetadataToServer(metadata);
      break;

      case 'mpv':
        mpvPageReadTracker();
      break;
    }
  }
}

console.log('Started');
new Main(window.document).start().then(() => {});
