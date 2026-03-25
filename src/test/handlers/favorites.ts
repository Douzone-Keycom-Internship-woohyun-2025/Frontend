import { http, HttpResponse } from "msw";
import type { FavoriteItem, FavoriteAnalysis } from "@/types/favorite";

const BASE = "http://localhost:3000";

export const mockFavoriteItem: FavoriteItem = {
  id: 1,
  applicationNumber: "10-2020-0001234",
  inventionTitle: "반도체 제조 방법",
  applicantName: "삼성전자",
  abstract: null,
  applicationDate: "20200115",
  openNumber: null,
  publicationNumber: null,
  publicationDate: null,
  registerNumber: null,
  registerDate: null,
  registerStatus: "등록",
  drawingUrl: null,
  mainIpcCode: "H01L",
  memo: null,
  createdAt: "2024-01-01T00:00:00Z",
};

export const mockAnalysis: FavoriteAnalysis = {
  totalCount: 1,
  statusCounts: [{ status: "등록", count: 1 }],
  ipcCounts: [{ ipc_code: "H01L", count: 1 }],
  monthlyCounts: [{ month: "2024-01", count: 1 }],
};

export const favoritesHandlers = [
  http.get(`${BASE}/favorites`, () =>
    HttpResponse.json({ data: { favorites: [mockFavoriteItem], total: 1 } })
  ),

  http.get(`${BASE}/favorites/analysis`, () =>
    HttpResponse.json({ data: mockAnalysis })
  ),

  http.post(`${BASE}/favorites`, () =>
    HttpResponse.json({ data: mockFavoriteItem }, { status: 201 })
  ),

  http.delete(`${BASE}/favorites/:applicationNumber`, () =>
    HttpResponse.json({ data: { success: true } })
  ),

  http.patch(`${BASE}/favorites/:applicationNumber`, () =>
    HttpResponse.json({ data: null })
  ),
];
