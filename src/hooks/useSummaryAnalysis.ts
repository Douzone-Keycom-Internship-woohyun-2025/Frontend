import { useMutation } from "@tanstack/react-query";
import type { SummaryData } from "@/types/summary";
import { getSummaryApi, type SummaryQuery } from "@/api/summary";
import { useState } from "react";

export function useSummaryAnalysis() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [lastParams, setLastParams] = useState<SummaryQuery | null>(null);

  const mutation = useMutation({
    mutationFn: getSummaryApi,
    onSuccess: (data) => {
      setSummaryData(data);
    },
  });

  const analyze = async (params: SummaryQuery) => {
    setLastParams(params);
    try {
      await mutation.mutateAsync(params);
    } catch {
      // mutation.error가 상태를 관리하므로 여기서는 무시
    }
  };

  const retry = () => {
    if (lastParams) mutation.mutate(lastParams);
  };

  return {
    summaryData,
    isLoading: mutation.isPending,
    error: mutation.error ? "요약 데이터를 분석하는 중 오류가 발생했습니다." : null,
    analyze,
    retry,
  };
}
