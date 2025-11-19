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
  inventionTitle?: string;
  applicantName?: string;
  applicationDate?: string;
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
  inventionTitle?: string;
  applicantName?: string;
  applicationDate?: string;
  openDate?: string;
  openNumber?: string;
  publicationDate?: string | null;
  publicationNumber?: string | null;
  registerDate?: string | null;
  registerNumber?: string | null;
  registerStatus?: PatentStatus;
  mainIpcCode?: string;
  ipcKorName?: string;
  ipcNumber?: string;
  astrtCont?: string;
  drawing?: string;
  isFavorite: boolean;
}
