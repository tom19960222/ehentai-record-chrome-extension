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