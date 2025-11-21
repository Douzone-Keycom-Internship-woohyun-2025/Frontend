export interface FavoriteItem {
  id: number;
  applicationNumber: string;
  inventionTitle: string;
  applicantName: string;
  abstract: string | null;
  applicationDate: string;
  openNumber: string | null;
  publicationNumber: string | null;
  publicationDate: string | null;
  registerNumber: string | null;
  registerDate: string | null;
  registerStatus: string | null;
  drawingUrl: string | null;
  mainIpcCode: string | null;
  createdAt: string;
}

export interface AddFavoritePayload {
  applicationNumber: string;
  inventionTitle: string;
  applicantName: string;
  abstract: string | null;
  applicationDate: string;
  openNumber: string | null;
  publicationNumber: string | null;
  publicationDate: string | null;
  registerNumber: string | null;
  registerDate: string | null;
  registerStatus: string | null;
  drawingUrl: string | null;
  ipcNumber: string | null;
  mainIpcCode: string | null;
}

export interface GetFavoritesResponse {
  total: number;
  favorites: FavoriteItem[];
}
