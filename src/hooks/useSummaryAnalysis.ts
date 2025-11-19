import { useState } from "react";
import type { SummaryData } from "../types/summary";
import { statusLabel } from "../utils/statusLabel";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";

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

      const filtered = dummyPatentListResponse.patents.filter((p) => {
        const applicantName = p.applicantName?.toLowerCase() || "";
        const query = applicant.toLowerCase();
        const matchesCompany = applicantName.includes(query);

        const filingDate = p.applicationDate
          ? new Date(p.applicationDate).getTime()
          : 0;

        const matchesStart =
          !startDate || filingDate >= new Date(startDate).getTime();
        const matchesEnd =
          !endDate || filingDate <= new Date(endDate).getTime();

        return matchesCompany && matchesStart && matchesEnd;
      });

      const ipcMap: Record<string, number> = {};
      filtered.forEach((p) => {
        if (p.mainIpcCode)
          ipcMap[p.mainIpcCode] = (ipcMap[p.mainIpcCode] || 0) + 1;
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

      const monthlyMap: Record<string, number> = {};
      filtered.forEach((p) => {
        if (!p.applicationDate) return;
        const month = p.applicationDate.substring(0, 7);
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
        const statusText = statusLabel[p.registerStatus || ""] || "기타";
        statusDistributionMap[statusText] =
          (statusDistributionMap[statusText] || 0) + 1;
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

      const recentPatents = filtered
        .sort((a, b) => {
          const t1 = a.applicationDate
            ? new Date(a.applicationDate).getTime()
            : 0;
          const t2 = b.applicationDate
            ? new Date(b.applicationDate).getTime()
            : 0;
          return t2 - t1;
        })
        .slice(0, 5)
        .map((p) => ({
          applicationNumber: p.applicationNumber ?? "",
          inventionTitle: p.inventionTitle ?? "",
          applicantName: p.applicantName ?? "",
          applicationDate: p.applicationDate ?? "",
          ipcCode: p.mainIpcCode ?? "",
          registerStatus: statusLabel[p.registerStatus || ""] || "기타",
          isFavorite: p.isFavorite ?? false,
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

      await new Promise((r) => setTimeout(r, 600));
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
