import { useState } from "react";
import type { PatentListItem, PatentStatus } from "../types/patent";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";

export function usePatentSearch() {
  const [results, setResults] = useState<PatentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPatents = async (filters: {
    applicant?: string;
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus | "";
    sortOrder?: "asc" | "desc";
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((res) => setTimeout(res, 300));

      let data = [...dummyPatentListResponse.patents];

      // 회사명 / 출원인
      const companyName = filters.companyName?.trim();
      if (companyName) {
        data = data.filter((p) =>
          p.applicantName?.toLowerCase().includes(companyName.toLowerCase())
        );
      }

      // 출원인
      const applicant = filters.applicant?.trim();
      if (applicant) {
        data = data.filter((p) =>
          p.applicantName?.toLowerCase().includes(applicant.toLowerCase())
        );
      }

      // 특허명(발명명칭)
      const patentName = filters.patentName?.trim();
      if (patentName) {
        data = data.filter((p) =>
          p.inventionTitle?.toLowerCase().includes(patentName.toLowerCase())
        );
      }

      // 시작일
      if (filters.startDate) {
        const start = new Date(filters.startDate).getTime();
        data = data.filter((p) => {
          if (!p.applicationDate) return false;
          return new Date(p.applicationDate).getTime() >= start;
        });
      }

      // 종료일
      if (filters.endDate) {
        const end = new Date(filters.endDate).getTime();
        data = data.filter((p) => {
          if (!p.applicationDate) return false;
          return new Date(p.applicationDate).getTime() <= end;
        });
      }

      // 상태 코드 (A, R, I 등)
      if (filters.status) {
        data = data.filter((p) => p.registerStatus === filters.status);
      }

      // 정렬 (출원일 기준)
      if (filters.sortOrder) {
        data.sort((a, b) => {
          const d1 = a.applicationDate
            ? new Date(a.applicationDate).getTime()
            : 0;
          const d2 = b.applicationDate
            ? new Date(b.applicationDate).getTime()
            : 0;

          return filters.sortOrder === "asc" ? d1 - d2 : d2 - d1;
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
