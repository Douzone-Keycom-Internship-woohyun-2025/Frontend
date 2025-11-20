export type PatentStatus =
  | "등록"
  | "공개"
  | "취하"
  | "소멸"
  | "포기"
  | "무효"
  | "거절"
  | "";

export interface BasicPatentSearchParams {
  applicant: string;
  startDate: string;
  endDate: string;
  page?: number;
}

export interface AdvancedPatentSearchParams {
  applicant?: string;
  inventionTitle?: string;
  registerStatus?: PatentStatus | "";
  startDate?: string;
  endDate?: string;
  page?: number;
}

export interface PatentListItem {
  applicationNumber: string;
  inventionTitle?: string;
  applicantName?: string;
  applicationDate?: string;
  mainIpcCode?: string;
  ipcKorName?: string;
  registerStatus?: PatentStatus | "";
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
  registerStatus?: PatentStatus | "";
  mainIpcCode?: string;
  ipcKorName?: string;
  ipcNumber?: string;
  astrtCont?: string;
  drawing?: string;
  isFavorite: boolean;
}
