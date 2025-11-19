export type PatentStatus = "A" | "C" | "F" | "G" | "I" | "J" | "R" | "";

export interface Patent {
  id: string;
  title: string;
  applicant: string;
  date: string;
  status: string;
}

export interface PatentListItem {
  applicationNumber: string;
  inventionTitle: string;
  applicant: string;
  applicationDate: string;
  mainIpcCode?: string;
  ipcKorName?: string;
  registerStatus?: PatentStatus;
  isFavorite: boolean;
}

export interface PatentListResponse {
  total: number;
  page: number;
  totalPages: number;
  patents: PatentListItem[];
}

export interface PatentDetail {
  applicationNumber: string;
  inventionTitle: string;
  applicant: string;
  applicationDate: string;
  status?: string;
  openDate?: string;
  openNumber?: string;
  publicationDate?: string;
  publicationNumber?: string;
  registerDate?: string;
  registerNumber?: string;
  mainIpcCode?: string;
  ipcKorName?: string;
  ipcNumber?: string;
  registerStatus?: PatentStatus;
  abstract?: string;
  drawingUrl?: string | null;
  isFavorite?: boolean;
}
