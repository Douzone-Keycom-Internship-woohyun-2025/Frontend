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
  sort?: "asc" | "desc";
};

type AdvancedSearchFilters = {
  patentName?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  status?: PatentStatus;
  sort?: "asc" | "desc";
};

type SearchFilters = BasicSearchFilters | AdvancedSearchFilters;

export function usePatentSearch() {
  const [results, setResults] = useState<PatentListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastFilters, setLastFilters] = useState<SearchFilters | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPatents = async (
    filters: SearchFilters,
    page: number = 1,
    sort: "asc" | "desc" = sortOrder
  ) => {
    setIsLoading(true);
    setError(null);
    setLastFilters(filters);

    try {
      const isAdvanced =
        "patentName" in filters ||
        "companyName" in filters ||
        "status" in filters;

      let response: PatentListResponse;

      if (isAdvanced) {
        const adv = filters as AdvancedSearchFilters;

        const mapped: AdvancedPatentSearchParams = {
          inventionTitle: adv.patentName || undefined,
          applicant: adv.companyName || undefined,
          registerStatus: adv.status || undefined,
          startDate: adv.startDate || "",
          endDate: adv.endDate || "",
          page,
          sort,
        };

        response = await searchPatentAdvanced(mapped);
      } else {
        const basic = filters as BasicSearchFilters;

        const mapped: BasicPatentSearchParams = {
          applicant: basic.applicant,
          startDate: basic.startDate,
          endDate: basic.endDate,
          page,
          sort,
        };

        response = await searchPatentBasic(mapped);
      }

      setResults(response.patents);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalCount(response.total);
    } catch (e) {
      console.error(e);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const changeSortOrder = async (order: "asc" | "desc") => {
    setSortOrder(order);

    if (lastFilters) {
      await filterPatents(lastFilters, 1, order);
    }
  };

  return {
    results,
    isLoading,
    error,
    totalPages,
    totalCount,
    currentPage,
    sortOrder,
    changeSortOrder,
    filterPatents,
  };
}
