import { useState } from "react";
import type { SummaryData } from "../types/summary";
import { getSummaryApi, type SummaryQuery } from "../api/summary";

export function useSummaryAnalysis() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (params: SummaryQuery) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getSummaryApi(params);
      setSummaryData(data);
    } catch (err) {
      console.error(err);
      setError("요약 데이터를 분석하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return { summaryData, isLoading, error, analyze };
}
