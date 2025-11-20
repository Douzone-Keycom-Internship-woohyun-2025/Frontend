export type PatentStatus =
  | "등록"
  | "공개"
  | "취하"
  | "소멸"
  | "포기"
  | "무효"
  | "거절"
  | "";

export type PatentSortOrder = "asc" | "desc";

export interface BasicPatentSearchParams {
  applicant: string;
  startDate: string;
  endDate: string;
  page?: number;
  sort?: PatentSortOrder;
}

export interface AdvancedPatentSearchParams {
  applicant?: string;
  inventionTitle?: string;
  registerStatus?: PatentStatus | "";
  startDate?: string;
  endDate?: string;
  page?: number;
  sort?: PatentSortOrder;
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
  inventionTitle: string;
  applicantName: string;
  applicationDate: string;
  openDate: string;
  publicationDate: string;
  registerDate: string;
  openNumber: string;
  publicationNumber: string;
  registerNumber: string;
  registerStatus: PatentStatus | "";
  mainIpcCode: string;
  ipcKorName: string;
  ipcNumber: string;
  astrtCont: string;
  drawing: string;
  bigDrawing: string;
  indexNo: string;
  isFavorite: boolean;
}
