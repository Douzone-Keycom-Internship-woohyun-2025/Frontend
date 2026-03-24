import api from "./axiosInstance";
import type { ComparisonResponse } from "@/types/comparison";

export interface ComparisonQuery {
  applicants: string[];
  startDate: string;
  endDate: string;
}

function normalizeDate(date?: string): string | undefined {
  if (!date) return undefined;
  return date.replace(/-/g, "");
}

export async function getComparisonApi(
  params: ComparisonQuery
): Promise<ComparisonResponse> {
  const res = await api.get("/summary/compare", {
    params: {
      applicants: params.applicants.join(","),
      startDate: normalizeDate(params.startDate),
      endDate: normalizeDate(params.endDate),
    },
  });
  return res.data.data;
}
