import { useState } from "react";
import SearchForm from "../components/common/SearchForm";
import type { SummaryData } from "../types/summary";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import ProtectedLayout from "../layouts/ProtectedLayout";

export default function SummaryPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ===== 더미데이터 기반 요약분석 =====
  const handleSearch = (formData: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    setIsLoading(true);

    setTimeout(() => {
      // 필터링
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

      // 상태 맵핑
      const statusMap: { [key: string]: string } = {
        pending: "출원",
        examining: "심사중",
        published: "공개",
        registered: "등록",
        rejected: "거절",
        abandoned: "포기",
        expired: "만료",
      };

      // IPC 분포 계산
      const ipcMap: { [key: string]: number } = {};
      filtered.forEach((patent) => {
        ipcMap[patent.ipcCode] = (ipcMap[patent.ipcCode] || 0) + 1;
      });

      const ipcDistribution = Object.entries(ipcMap)
        .map(([code, count]) => ({
          ipcCode: code,
          ipcName: code,
          count,
          percentage: Math.round((count / filtered.length) * 100 * 10) / 10,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // 월별 추세 계산
      const monthlyMap: { [key: string]: number } = {};
      filtered.forEach((patent) => {
        const month = patent.filingDate.substring(0, 7);
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
      });

      const monthlyTrend = Object.entries(monthlyMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count], _, sortedArr) => {
          const cumulativeCount = sortedArr
            .slice(0, sortedArr.findIndex(([m]) => m === month) + 1)
            .reduce((sum, [, c]) => sum + c, 0);
          return { month, count, cumulativeCount };
        });

      // 상태 분포 계산
      const statusMap2: { [key: string]: number } = {};
      filtered.forEach((patent) => {
        const status = statusMap[patent.status] || patent.status;
        statusMap2[status] = (statusMap2[status] || 0) + 1;
      });

      const statusDistribution = Object.entries(statusMap2)
        .map(([status, count]) => ({
          status,
          count,
          percentage: Math.round((count / filtered.length) * 100 * 10) / 10,
        }))
        .sort((a, b) => b.count - a.count);

      // 등록률 (공개 상태의 비율)
      const registrationRate =
        Math.round(((statusMap2["공개"] || 0) / filtered.length) * 100 * 10) /
        10;

      // 월평균
      const monthlyAverage =
        Math.round((filtered.length / monthlyTrend.length) * 10) / 10;

      // 최근 특허
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
          registerStatus: statusMap[patent.status] || patent.status,
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">요약분석</h1>
                <p className="mt-2 text-gray-600">
                  회사의 R&D 동향을 한눈에 분석하세요
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* 검색 영역 */}
          <div className="mb-8">
            <SearchForm
              enablePresets={true}
              storageKey="searchPresets"
              title="요약분석"
              loading={isLoading}
              onSearch={handleSearch}
            />
          </div>

          {/* 검색 결과 */}
          {summaryData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                분석 결과
              </h2>

              {/* JSON 출력 (임시) */}
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
                {JSON.stringify(summaryData, null, 2)}
              </pre>
            </div>
          )}

          {/* 검색 전 안내 메시지 */}
          {!summaryData && !isLoading && (
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
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
