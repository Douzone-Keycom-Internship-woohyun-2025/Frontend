import { useState } from "react";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import ComparisonDashboard from "@/components/comparison/ComparisonDashboard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { useComparison } from "@/hooks/useComparison";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComparisonPage() {
  const { comparisonData, isLoading, error, compare, retry } = useComparison();
  const [applicants, setApplicants] = useState<string[]>(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const addApplicant = () => {
    if (applicants.length < 5) setApplicants([...applicants, ""]);
  };

  const removeApplicant = (index: number) => {
    if (applicants.length > 2) {
      setApplicants(applicants.filter((_, i) => i !== index));
    }
  };

  const updateApplicant = (index: number, value: string) => {
    const updated = [...applicants];
    updated[index] = value;
    setApplicants(updated);
  };

  const handleCompare = async () => {
    const validApplicants = applicants.map((a) => a.trim()).filter(Boolean);
    if (validApplicants.length < 2 || !startDate || !endDate) return;
    await compare({ applicants: validApplicants, startDate, endDate });
  };

  const canSubmit =
    applicants.filter((a) => a.trim()).length >= 2 && startDate && endDate && !isLoading;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">경쟁사 비교</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                여러 회사의 특허 동향을 비교 분석하여 기술 경쟁력을 파악하세요.
              </p>
            </div>
            <div className="hidden md:flex items-center text-gray-500 text-sm">
              <i className="ri-scales-line text-brand-700 mr-2" />
              경쟁사 비교 모드
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              비교 대상 설정
            </h2>

            <div className="space-y-3 mb-6">
              {applicants.map((applicant, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-gray-500 shrink-0 sm:w-16">
                    회사 {index + 1}
                  </span>
                  <Input
                    value={applicant}
                    onChange={(e) => updateApplicant(index, e.target.value)}
                    placeholder="출원인/회사명 입력"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeApplicant(index)}
                    disabled={applicants.length <= 2}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent self-end sm:self-auto"
                    aria-label={`회사 ${index + 1} 삭제`}
                  >
                    <i className="ri-delete-bin-line text-lg" />
                  </button>
                </div>
              ))}

              {applicants.length < 5 && (
                <button
                  type="button"
                  onClick={addApplicant}
                  className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-800 font-medium sm:ml-16 pl-1"
                >
                  <i className="ri-add-circle-line text-lg" />
                  회사 추가 (최대 5개)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  시작일
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  종료일
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleCompare}
              disabled={!canSubmit}
              className="w-full sm:w-auto h-11"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2" />
                  분석 중...
                </>
              ) : (
                <>
                  <i className="ri-scales-line mr-2" />
                  비교 분석 시작
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingSpinner
              message="비교 분석 데이터를 가져오는 중입니다..."
              size="md"
            />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : comparisonData ? (
            <ComparisonDashboard data={comparisonData} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-brand-100 rounded-full">
                <i className="ri-scales-line text-2xl text-brand-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                경쟁사 비교를 시작하세요
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                2~5개 출원인과 분석 기간을 입력하여 특허 동향을 비교 분석해보세요.
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
