import { useState } from "react";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import type { SummaryData } from "../types/summary";
import { statusLabel } from "../utils/statusLabel";

interface SearchParams {
  applicant: string;
  startDate: string;
  endDate: string;
}

export function useSummaryAnalysis() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async ({ applicant, startDate, endDate }: SearchParams) => {
    try {
      setIsLoading(true);
      setError(null);

      // 더미 데이터 필터링
      const filtered = dummyPatentListResponse.patents.filter((patent) => {
        const applicantName = patent.applicant.toLowerCase();
        const query = applicant.toLowerCase();
        const matchesCompany = applicantName.includes(query);

        const filingDate = new Date(patent.filingDate).getTime();
        const matchesStart =
          !startDate || filingDate >= new Date(startDate).getTime();
        const matchesEnd =
          !endDate || filingDate <= new Date(endDate).getTime();

        return matchesCompany && matchesStart && matchesEnd;
      });

      // IPC 분포 계산
      const ipcMap: Record<string, number> = {};
      filtered.forEach((p) => {
        if (p.ipcCode) ipcMap[p.ipcCode] = (ipcMap[p.ipcCode] || 0) + 1;
      });
      const ipcDistribution = Object.entries(ipcMap)
        .map(([ipcCode, count]) => ({
          ipcCode,
          ipcName: ipcCode,
          count,
          percentage: filtered.length
            ? Math.round((count / filtered.length) * 1000) / 10
            : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // 월별 트렌드
      const monthlyMap: Record<string, number> = {};
      filtered.forEach((p) => {
        const month = p.filingDate.substring(0, 7);
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
      });
      const monthlyTrend = Object.entries(monthlyMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count], _, arr) => {
          const cumulativeCount = arr
            .slice(0, arr.findIndex(([m]) => m === month) + 1)
            .reduce((sum, [, c]) => sum + c, 0);
          return { month, count, cumulativeCount };
        });

      const statusDistributionMap: Record<string, number> = {};
      filtered.forEach((p) => {
        const status = statusLabel[p.status] || p.status;
        statusDistributionMap[status] =
          (statusDistributionMap[status] || 0) + 1;
      });
      const statusDistribution = Object.entries(statusDistributionMap).map(
        ([status, count]) => ({
          status,
          count,
          percentage: filtered.length
            ? Math.round((count / filtered.length) * 1000) / 10
            : 0,
        })
      );

      // 주요 통계
      const registrationRate =
        filtered.length > 0
          ? Math.round(
              ((statusDistributionMap["등록"] || 0) / filtered.length) * 1000
            ) / 10
          : 0;
      const monthlyAverage =
        filtered.length && monthlyTrend.length
          ? Math.round((filtered.length / monthlyTrend.length) * 10) / 10
          : 0;

      // 최신 특허 5건 - statusLabel 사용
      const recentPatents = filtered
        .sort(
          (a, b) =>
            new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime()
        )
        .slice(0, 5)
        .map((p) => ({
          applicationNumber: p.applicationNumber.toString(),
          inventionTitle: p.title,
          applicantName: p.applicant,
          applicationDate: p.filingDate,
          ipcCode: p.ipcCode,
          registerStatus: statusLabel[p.status] || p.status, // 여기 변경!
          isFavorite: false,
        }));

      const summary: SummaryData = {
        statistics: {
          totalPatents: filtered.length,
          registrationRate,
          monthlyAverage,
          searchPeriod: {
            startDate: startDate || "제한 없음",
            endDate: endDate || "제한 없음",
          },
        },
        ipcDistribution,
        monthlyTrend,
        statusDistribution,
        recentPatents,
      };

      await new Promise((r) => setTimeout(r, 800));
      setSummaryData(summary);
    } catch (err) {
      console.error(err);
      setError("요약 데이터를 분석하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return { summaryData, isLoading, error, analyze };
}
