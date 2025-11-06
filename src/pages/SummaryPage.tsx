import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import SearchForm from "../components/common/SearchForm";
import SummaryDashboard from "../components/Summary/SummaryDashboard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import { useSummaryAnalysis } from "../hooks/useSummaryAnalysis";

export default function SummaryPage() {
  const location = useLocation();
  const { summaryData, isLoading, error, analyze } = useSummaryAnalysis();
  const [initialFilters, setInitialFilters] = useState<{
    applicant: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    const preset = location.state?.preset;
    if (preset) {
      const presetParams = {
        applicant: preset.applicant || "",
        startDate: preset.startDate || "",
        endDate: preset.endDate || "",
      };
      setInitialFilters(presetParams);
      analyze(presetParams);
    }
  }, [location.state, analyze]);

  const handleSearch = async (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    await analyze(params);
    setInitialFilters(params);
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <LoadingSpinner message="요약 데이터를 분석 중입니다..." size="md" />
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">요약분석</h1>
              <p className="mt-2 text-gray-600">
                회사의 R&D 동향을 한눈에 파악하고 특허 현황을 시각적으로
                분석하세요.
              </p>
            </div>
            <div className="hidden md:flex items-center text-gray-500 text-sm">
              <i className="ri-bar-chart-line text-blue-600 mr-2"></i>
              대시보드 요약 모드
            </div>
          </div>
        </header>

        {/* 본문 */}
        <main className="px-8 py-8">
          {/* 검색 섹션 */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <SearchForm
              enablePresets
              storageKey="searchPresets"
              title="요약분석"
              loading={isLoading}
              onSearch={handleSearch}
              initialValues={initialFilters || undefined}
            />
          </div>

          {/* 결과 섹션 */}
          {summaryData ? (
            <div className="bg-white rounded-lg shadow p-8">
              <SummaryDashboard
                data={summaryData}
                presetFilters={
                  initialFilters || {
                    applicant: "",
                    startDate: "",
                    endDate: "",
                  }
                }
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-blue-100 rounded-full">
                <i className="ri-bar-chart-box-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                R&D 동향 분석을 시작하세요
              </h3>
              <p className="text-gray-600">
                회사명과 분석 기간을 입력하여 특허 동향을 시각적으로
                분석해보세요.
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
