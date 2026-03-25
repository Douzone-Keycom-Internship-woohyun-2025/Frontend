import api from "./axiosInstance";
import type { SummaryData, BackendSummaryResponse } from "@/types/summary";

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

  const totalPatents = raw.statistics.totalPatents;

  const statistics: SummaryData["statistics"] = {
    totalPatents,
    registrationRate: raw.statistics.registrationRate,
    monthlyAverage: raw.statistics.monthlyAverage,
    searchPeriod: {
      startDate: raw.period.startDate,
      endDate: raw.period.endDate,
    },
  };

  const ipcDistribution: SummaryData["ipcDistribution"] = raw.ipcDistribution.map(
    (item) => ({
      ipcCode: item.ipcCode,
      ipcName: item.ipcKorName,
      count: item.count,
      percentage:
        totalPatents > 0
          ? Number(((item.count / totalPatents) * 100).toFixed(1))
          : 0,
    })
  );

  const monthlyTrend: SummaryData["monthlyTrend"] = raw.monthlyTrend.map(
    (item, index, arr) => ({
      month: item.month,
      count: item.count,
      cumulativeCount: arr
        .slice(0, index + 1)
        .reduce((sum, m) => sum + m.count, 0),
    })
  );

  const totalStatusCount = raw.statusDistribution.reduce(
    (sum, s) => sum + s.count, 0
  );

  const statusDistribution: SummaryData["statusDistribution"] =
    raw.statusDistribution.map((item) => ({
      status: item.status,
      count: item.count,
      percentage:
        totalStatusCount > 0
          ? Number(((item.count / totalStatusCount) * 100).toFixed(1))
          : 0,
    }));

  const recentPatents: SummaryData["recentPatents"] = raw.recentPatents.map(
    (p) => ({
      applicationNumber: p.applicationNumber,
      inventionTitle: p.title,
      applicantName: raw.applicant,
      applicationDate: p.date,
      ipcCode: p.ipcMain ?? "",
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
