import api from "./axiosInstance";
import type { SummaryData, BackendSummaryResponse } from "../types/summary";

export interface SummaryQuery {
  applicant?: string;
  startDate?: string;
  endDate?: string;
  presetId?: number;
}

function normalizeDate(date?: string): string | undefined {
  if (!date) return undefined;
  return date.replace(/-/g, "");
}

export async function getSummaryApi(
  params: SummaryQuery
): Promise<SummaryData> {
  const query: Record<string, string | number | undefined> = {};

  if (params.presetId) {
    query.presetId = params.presetId;
  } else {
    if (params.applicant) query.applicant = params.applicant;
    if (params.startDate) query.startDate = normalizeDate(params.startDate);
    if (params.endDate) query.endDate = normalizeDate(params.endDate);
  }

  const res = await api.get("/summary", { params: query });

  const raw: BackendSummaryResponse = res.data.data;

  // -----------------------------
  // 🔥 statistics
  // -----------------------------
  const statistics: SummaryData["statistics"] = {
    totalPatents: raw.totalCount,
    registrationRate: raw.statusPercent?.등록 ?? 0,
    monthlyAverage: raw.avgMonthlyCount,
    searchPeriod: {
      startDate: raw.period.startDate,
      endDate: raw.period.endDate,
    },
  };

  // -----------------------------
  // 🔥 IPC 분포
  // -----------------------------
  const ipcDistribution: SummaryData["ipcDistribution"] = raw.topIPC.map(
    (item) => ({
      ipcCode: item.code,
      ipcName: item.code,
      count: item.count,
      percentage:
        raw.totalCount > 0
          ? Number(((item.count / raw.totalCount) * 100).toFixed(1))
          : 0,
    })
  );

  // -----------------------------
  // 🔥 월별 추세
  // -----------------------------
  const monthlyTrend: SummaryData["monthlyTrend"] = raw.monthlyTrend.map(
    (item, index, arr) => ({
      month: item.month,
      count: item.count,
      cumulativeCount: arr
        .slice(0, index + 1)
        .reduce((sum, m) => sum + m.count, 0),
    })
  );

  // -----------------------------
  // 🔥 상태 분포
  // -----------------------------
  const statusDistribution: SummaryData["statusDistribution"] = Object.entries(
    raw.statusCount
  ).map(([status, count]) => ({
    status,
    count: Number(count),
    percentage: raw.statusPercent?.[status] ?? 0,
  }));

  // -----------------------------
  // 🔥 최근 특허
  // -----------------------------
  const recentPatents: SummaryData["recentPatents"] = raw.recentPatents.map(
    (p) => ({
      applicationNumber: "",
      inventionTitle: p.title,
      applicantName: raw.applicant,
      applicationDate: p.date,
      ipcCode: p.ipcMain,
      registerStatus: p.status,
      isFavorite: false,
    })
  );

  return {
    statistics,
    ipcDistribution,
    monthlyTrend,
    statusDistribution,
    recentPatents,
  };
}
