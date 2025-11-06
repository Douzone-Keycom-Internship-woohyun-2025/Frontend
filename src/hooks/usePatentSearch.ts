import { useState } from "react";
import type { PatentListItem, PatentStatus } from "../types/patent";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";

export function usePatentSearch() {
  const [results, setResults] = useState<PatentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPatents = async (filters: {
    applicant: string;
    patentName: string;
    companyName: string;
    startDate: string;
    endDate: string;
    status: PatentStatus | "";
    sortOrder?: "asc" | "desc";
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((res) => setTimeout(res, 400));
      let data = [...dummyPatentListResponse.patents];

      if (filters.applicant) {
        data = data.filter((p) =>
          p.applicant.toLowerCase().includes(filters.applicant.toLowerCase())
        );
      }
      if (filters.patentName) {
        data = data.filter((p) =>
          p.title.toLowerCase().includes(filters.patentName.toLowerCase())
        );
      }
      if (filters.companyName) {
        data = data.filter((p) =>
          p.applicant.toLowerCase().includes(filters.companyName.toLowerCase())
        );
      }
      if (filters.startDate) {
        const start = new Date(filters.startDate).getTime();
        data = data.filter((p) => new Date(p.filingDate).getTime() >= start);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate).getTime();
        data = data.filter((p) => new Date(p.filingDate).getTime() <= end);
      }
      if (filters.status) {
        data = data.filter((p) => p.status === filters.status);
      }

      if (filters.sortOrder) {
        data.sort((a, b) => {
          const timeA = new Date(a.filingDate).getTime();
          const timeB = new Date(b.filingDate).getTime();
          return filters.sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        });
      }

      setResults(data);
    } catch {
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, filterPatents };
}
