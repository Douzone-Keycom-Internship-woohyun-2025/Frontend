import api from "./axiosInstance";
import type { SummaryData } from "../types/summary";

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
  return res.data.data as SummaryData;
}
