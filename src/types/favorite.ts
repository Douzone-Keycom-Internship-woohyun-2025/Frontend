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
  memo: string | null;
  createdAt: string;
}

export interface FavoriteAnalysis {
  totalCount: number;
  statusCounts: Array<{ status: string; count: number }>;
  ipcCounts: Array<{ ipc_code: string; count: number }>;
  monthlyCounts: Array<{ month: string; count: number }>;
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
