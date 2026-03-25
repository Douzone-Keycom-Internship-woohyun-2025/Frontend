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
  const [isExporting, setIsExporting] = useState(false);

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
      const isAdvanced = !("applicant" in filters);

      let response: PatentListResponse;

      if (isAdvanced) {
        const adv = filters as AdvancedSearchFilters;
        const mapped: AdvancedPatentSearchParams = {
          inventionTitle: adv.patentName || undefined,
          applicant: adv.companyName || undefined,
          registerStatus: adv.status || undefined,
          startDate: adv.startDate || undefined,
          endDate: adv.endDate || undefined,
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
    if (lastFilters) mutation.mutate({ filters: lastFilters, page: currentPage, sort: sortOrder });
  };

  const fetchAllResults = async (): Promise<PatentListItem[]> => {
    if (!lastFilters) return [];
    if (totalPages <= 1) return results;

    setIsExporting(true);
    try {
      const allItems: PatentListItem[] = [];
      const maxPages = Math.min(totalPages, 50);
      for (let page = 1; page <= maxPages; page++) {
        const isAdvanced = !("applicant" in lastFilters);
        let response: PatentListResponse;
        if (isAdvanced) {
          const adv = lastFilters as AdvancedSearchFilters;
          response = await searchPatentAdvanced({
            inventionTitle: adv.patentName || undefined,
            applicant: adv.companyName || undefined,
            registerStatus: adv.status || undefined,
            startDate: adv.startDate || undefined,
            endDate: adv.endDate || undefined,
            page,
            sort: sortOrder,
          });
        } else {
          const basic = lastFilters as BasicSearchFilters;
          response = await searchPatentBasic({
            applicant: basic.applicant,
            startDate: basic.startDate,
            endDate: basic.endDate,
            page,
            sort: sortOrder,
          });
        }
        allItems.push(...response.patents);
      }
      return allItems;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    results,
    isLoading: mutation.isPending,
    error: mutation.error ? "검색 중 오류가 발생했습니다." : null,
    totalPages,
    totalCount,
    currentPage,
    sortOrder,
    isExporting,
    changeSortOrder,
    filterPatents,
    fetchAllResults,
    retry,
  };
}
