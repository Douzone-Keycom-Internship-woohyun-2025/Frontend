import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { searchPatentBasic, searchPatentAdvanced } from "@/api/patent";

import type {
  PatentListItem,
  BasicPatentSearchParams,
  AdvancedPatentSearchParams,
  PatentListResponse,
  PatentStatus,
} from "@/types/patent";

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

  const mutation = useMutation({
    mutationFn: async ({
      filters,
      page,
      sort,
    }: {
      filters: SearchFilters;
      page: number;
      sort: "asc" | "desc";
    }) => {
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

      return response;
    },
    onSuccess: (response) => {
      setResults(response.patents);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalCount(response.total);
    },
  });

  const filterPatents = async (
    filters: SearchFilters,
    page: number = 1,
    sort: "asc" | "desc" = sortOrder
  ) => {
    setLastFilters(filters);
    await mutation.mutateAsync({ filters, page, sort });
  };

  const changeSortOrder = async (order: "asc" | "desc") => {
    setSortOrder(order);
    if (lastFilters) {
      await filterPatents(lastFilters, 1, order);
    }
  };

  const retry = () => {
    if (lastFilters) filterPatents(lastFilters, currentPage, sortOrder);
  };

  return {
    results,
    isLoading: mutation.isPending,
    error: mutation.error ? "검색 중 오류가 발생했습니다." : null,
    totalPages,
    totalCount,
    currentPage,
    sortOrder,
    changeSortOrder,
    filterPatents,
    retry,
  };
}
