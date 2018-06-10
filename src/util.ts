import {GalleryInfo, Position} from './model';

export function extractURLInformation(URL: string) {
  const galleryMatch = URL.match(
    /https:\/\/(exhentai|e-hentai).org\/g\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/
  );
  const mpvPageMatch = URL.match(
    /https:\/\/(exhentai|e-hentai).org\/mpv\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)\/?/
  );
  const singlePageMatch = URL.match(
    /https:\/\/(exhentai|e-hentai).org\/s\/([0-9A-Za-z]+)\/([0-9A-Za-z]+)-([0-9]+)\/?/
  );
  const searchPageMatch = URL.match(
    /https:\/\/(exhentai|e-hentai).org\/.*/g
  );
  const isInSearchPage = URL.split(/\//g).length === 4; // In search/home page, there should be 3 slashs. (http:// and slash in path)

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
  if (searchPageMatch && isInSearchPage)
    return new GalleryInfo({
      position: Position.search,
      galleryId: null,
      galleryToken: null,
      site: searchPageMatch[1],
      page: null
    })
}