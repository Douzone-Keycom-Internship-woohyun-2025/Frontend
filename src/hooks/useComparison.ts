import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getComparisonApi, type ComparisonQuery } from "@/api/comparison";
import type { ComparisonResponse } from "@/types/comparison";

export function useComparison() {
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [lastParams, setLastParams] = useState<ComparisonQuery | null>(null);

  const mutation = useMutation({
    mutationFn: getComparisonApi,
    onSuccess: (data) => {
      setComparisonData(data);
    },
  });

  const compare = async (params: ComparisonQuery) => {
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
    comparisonData,
    isLoading: mutation.isPending,
    error: mutation.error ? "비교 분석 중 오류가 발생했습니다." : null,
    compare,
    retry,
  };
}
