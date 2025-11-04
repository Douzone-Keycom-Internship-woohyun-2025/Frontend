export type PatentStatus =
  | "pending"
  | "examining"
  | "published"
  | "registered"
  | "rejected"
  | "abandoned"
  | "expired";

export interface PatentListItem {
  applicationNumber: number;
  title: string;
  applicant: string;
  filingDate: string;
  ipcCode: string;
  status: PatentStatus;
  isFavorite: boolean;
}

export interface PatentListResponse {
  total: number;
  page: number;
  totalPages: number;
  patents: PatentListItem[];
}

export interface PatentDetail {
  applicationNumber: number;
  title: string;
  applicant: string;
  filingDate: string;
  openDate?: string;
  openNumber?: number;
  publicationDate?: string | null;
  publicationNumber?: number | null;
  registerDate?: string | null;
  registerNumber?: number | null;
  ipcMain: string;
  ipcAll: string[];
  status: PatentStatus;
  abstract: string;
  bigDrawing?: string | null;
  drawing?: string | null;
}
