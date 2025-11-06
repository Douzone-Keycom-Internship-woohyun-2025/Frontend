export type PatentStatus =
  | "pending"
  | "examining"
  | "published"
  | "registered"
  | "rejected"
  | "abandoned"
  | "expired";

export interface Patent {
  id: string;
  title: string;
  applicant: string;
  date: string;
  status: string;
}

export interface PatentListItem {
  applicationNumber: number;
  title: string;
  applicant: string;
  filingDate: string;
  ipcCode: string;
  ipcCodeField: string; // ← DB에서 이미 매핑된 분야명 (예: "컴퓨터")
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
  ipcMain: string; // "G06F"
  ipcMainField: string; // "컴퓨터" (← DB에서 이미 매핑)
  ipcAll: string[]; // ["G06F", "H04L"]
  ipcAllFields: string[]; // ["컴퓨터", "통신"] (← DB에서 이미 매핑)
  status: PatentStatus;
  abstract: string;
  bigDrawing?: string | null;
  drawing?: string | null;
}
