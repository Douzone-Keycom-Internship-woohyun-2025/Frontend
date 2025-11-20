import { useState } from "react";
import { searchPatentBasic, searchPatentAdvanced } from "../api/patent";

import type {
  PatentListItem,
  BasicPatentSearchParams,
  AdvancedPatentSearchParams,
  PatentListResponse,
  PatentStatus,
} from "../types/patent";

type BasicSearchFilters = {
  applicant: string;
  startDate: string;
  endDate: string;
};

type AdvancedSearchFilters = {
  patentName?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  status?: PatentStatus;
};

type SearchFilters = BasicSearchFilters | AdvancedSearchFilters;

export function usePatentSearch() {
  const [results, setResults] = useState<PatentListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPatents = async (filters: SearchFilters, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: PatentListResponse;

      const isAdvanced =
        "patentName" in filters ||
        "companyName" in filters ||
        "status" in filters;

      if (isAdvanced) {
        const advFilters = filters as AdvancedSearchFilters;

        const mapped: AdvancedPatentSearchParams = {
          inventionTitle: advFilters.patentName || undefined,
          applicant: advFilters.companyName || undefined,
          registerStatus: advFilters.status || undefined,
          startDate: advFilters.startDate || "",
          endDate: advFilters.endDate || "",
          page,
        };

        response = await searchPatentAdvanced(mapped);
      } else {
        const basicFilters = filters as BasicSearchFilters;

        const mapped: BasicPatentSearchParams = {
          applicant: basicFilters.applicant,
          startDate: basicFilters.startDate,
          endDate: basicFilters.endDate,
          page,
        };

        response = await searchPatentBasic(mapped);
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
