import { useState } from "react";
import { searchPatentBasic, searchPatentAdvanced } from "../api/patent";

import type {
  PatentListItem,
  BasicPatentSearchParams,
  AdvancedPatentSearchParams,
  PatentListResponse,
} from "../types/patent";

export function usePatentSearch() {
  const [results, setResults] = useState<PatentListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPatents = async (
    filters: BasicPatentSearchParams | AdvancedPatentSearchParams,
    page: number = 1
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: PatentListResponse;

      const isAdvanced =
        "inventionTitle" in filters ||
        "registerStatus" in filters ||
        "companyName" in filters;

      if (isAdvanced) {
        response = await searchPatentAdvanced({
          ...(filters as AdvancedPatentSearchParams),
          page,
        });
      } else {
        response = await searchPatentBasic({
          ...(filters as BasicPatentSearchParams),
          page,
        });
      }

      setResults(response.patents);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalCount(response.total);
    } catch (err) {
      console.error(err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    results,
    isLoading,
    error,
    totalPages,
    totalCount,
    currentPage,
    filterPatents,
  };
}
