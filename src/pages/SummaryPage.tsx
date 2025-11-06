import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchForm from "../components/common/SearchForm";
import SummaryDashboard from "../components/Summary/SummaryDashboard";
import type { SummaryData } from "../types/summary";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { statusLabel } from "../utils/statusLabel";

export default function SummaryPage() {
  const location = useLocation();

  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialPreset, setInitialPreset] = useState<{
    applicant: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    const preset = location.state?.preset;
    if (preset) {
      const presetParams = {
        applicant: preset.companyName || "",
        startDate: preset.startDate || "",
        endDate: preset.endDate || "",
      };
      setInitialPreset(presetParams);
      handleSearch(presetParams);
    }
  }, [location.state]);

  const handleSearch = (formData: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    setInitialPreset(formData);
    setIsLoading(true);

    setTimeout(() => {
      const filtered = dummyPatentListResponse.patents.filter((patent) => {
        const applicantName = patent.applicant.toLowerCase();
        const companyName = formData.applicant.toLowerCase();
        const matchesCompany = applicantName.includes(companyName);

        const patentDate = new Date(patent.filingDate).getTime();
        const matchesStartDate =
          !formData.startDate ||
          patentDate >= new Date(formData.startDate).getTime();
        const matchesEndDate =
          !formData.endDate ||
          patentDate <= new Date(formData.endDate).getTime();

        return matchesCompany && matchesStartDate && matchesEndDate;
      });

      const ipcMap: Record<string, number> = {};
      filtered.forEach((patent) => {
        if (patent.ipcCode) {
          ipcMap[patent.ipcCode] = (ipcMap[patent.ipcCode] || 0) + 1;
        }
      });

      const ipcDistribution = Object.entries(ipcMap)
        .map(([code, count]) => ({
          ipcCode: code,
          ipcName: code,
          count,
          percentage: Math.round((count / filtered.length) * 1000) / 10,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const monthlyMap: Record<string, number> = {};
      filtered.forEach((patent) => {
        const month = patent.filingDate.substring(0, 7);
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
      filtered.forEach((patent) => {
        const status = statusLabel[patent.status] || patent.status;
        statusDistributionMap[status] =
          (statusDistributionMap[status] || 0) + 1;
      });

      const statusDistribution = Object.entries(statusDistributionMap)
        .map(([status, count]) => ({
          status,
          count,
          percentage: Math.round((count / filtered.length) * 1000) / 10,
        }))
        .sort((a, b) => b.count - a.count);

      const registrationRate =
        Math.round(
          ((statusDistributionMap["등록"] || 0) / filtered.length) * 1000
        ) / 10;

      const monthlyAverage =
        Math.round((filtered.length / monthlyTrend.length) * 10) / 10;

      const recentPatents = filtered
        .sort(
          (a, b) =>
            new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime()
        )
        .slice(0, 5)
        .map((patent) => ({
          applicationNumber: patent.applicationNumber.toString(),
          inventionTitle: patent.title,
          applicantName: patent.applicant,
          applicationDate: patent.filingDate,
          ipcCode: patent.ipcCode,
          registerStatus: statusLabel[patent.status] || patent.status,
          isFavorite: false,
        }));

      const summary: SummaryData = {
        statistics: {
          totalPatents: filtered.length,
          registrationRate,
          monthlyAverage,
          searchPeriod: {
            startDate: formData.startDate || "제한 없음",
            endDate: formData.endDate || "제한 없음",
          },
        },
        ipcDistribution,
        monthlyTrend,
        statusDistribution,
        recentPatents,
      };

      setSummaryData(summary);
      setIsLoading(false);
    }, 800);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 ml-64">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900">요약분석</h1>
            <p className="mt-2 text-gray-600">
              회사의 R&D 동향을 한눈에 분석하세요
            </p>
          </div>
        </header>

        {/* 메인 */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <SearchForm
              enablePresets={true}
              storageKey="searchPresets"
              title="요약분석"
              loading={isLoading}
              onSearch={handleSearch}
              initialValues={initialPreset || undefined}
            />
          </div>

          {summaryData ? (
            <SummaryDashboard
              data={summaryData}
              presetFilters={{
                applicant: initialPreset?.applicant || "",
                startDate: initialPreset?.startDate || "",
                endDate: initialPreset?.endDate || "",
              }}
            />
          ) : (
            !isLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-blue-100 rounded-full">
                  <i className="ri-bar-chart-line text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  R&D 동향 분석을 시작하세요
                </h3>
                <p className="text-gray-600">
                  회사명과 분석 기간을 입력하여 특허 동향을 분석해보세요.
                </p>
              </div>
            )
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
