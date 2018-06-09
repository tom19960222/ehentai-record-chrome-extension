// console.log(document.URL);
import { ServerRequestAction } from "./ServerRequestAction";
import { mpvPageReadTracker } from "./mpvPageReadTracker";

export enum Position {
  gallery = 'gallery',
  mpv = 'mpv',
  single = 'single'
}
export class GalleryInfo {
  position: Position;
  galleryId: number;
  galleryToken: string;
  site: string;
  page: number | null;

  constructor({
    position,
    galleryId,
    galleryToken,
    site,
    page
  }: {
    position: Position;
    galleryId: number;
    galleryToken: string;
    site: string;
    page: number | null;
  }) {
    this.position = position;
    this.galleryId = galleryId;
    this.galleryToken = galleryToken;
    this.site = site;
    this.page = page;
  }
}

export class Main {
  private document: Document;
  private serverRequestAction: ServerRequestAction;

  constructor(document: Document) {
    this.document = document;
    this.serverRequestAction = new ServerRequestAction();
  }

  extractURLInformation(URL: string) {
    const galleryMatch = URL.match(
      /https:\/\/(exhentai|e-hentai).org\/g\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/
    );
    const mpvPageMatch = URL.match(
      /https:\/\/(exhentai|e-hentai).org\/mpv\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/
    );
    const singlePageMatch = URL.match(
      /https:\/\/(exhentai|e-hentai).org\/s\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)-([0-9]+)\/?/
    );
    if (galleryMatch && galleryMatch.length === 4)
      return new GalleryInfo({
        position: Position.gallery,
        galleryId: parseInt(galleryMatch[2]),
        galleryToken: galleryMatch[3],
        site: galleryMatch[1],
        page: null
      });
    if (mpvPageMatch && mpvPageMatch.length === 4)
      return new GalleryInfo({
        position: Position.mpv,
        galleryId: parseInt(mpvPageMatch[2]),
        galleryToken: mpvPageMatch[3],
        site: mpvPageMatch[1],
        page: null
      });
    if (singlePageMatch && singlePageMatch.length === 5)
      return new GalleryInfo({
        position: Position.single,
        galleryId: parseInt(singlePageMatch[3]),
        galleryToken: singlePageMatch[2],
        site: singlePageMatch[1],
        page: parseInt(singlePageMatch[4])
      });
  }

  async start() {
    console.log("document.URL", this.document.URL);
    const urlInfo = this.extractURLInformation(this.document.URL);

    if (!urlInfo){
      // Not in target website.
      console.log(urlInfo, 'urlInfo');
      return;
    }

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
        break;

      case Position.mpv:
        new mpvPageReadTracker({ serverRequestAction: this.serverRequestAction, galleryInfo: urlInfo });
        break;
    }
  }
}

new Main(window.document).start().then(() => {});
