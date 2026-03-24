import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import BasicSearch from "@/components/patent-search/BasicSearch";
import AdvancedSearch from "@/components/patent-search/AdvancedSearch";
import PatentList from "@/components/patent/PatentList";
import { SkeletonPatentRows } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import { usePatentSearch } from "@/hooks/usePatentSearch";
import { useFavorites } from "@/hooks/useFavorites";
import type { PatentStatus } from "@/types/patent";
import { toApiDateFormat, toInputDateFormat } from "@/utils/dateTransform";
import { downloadCsv } from "@/utils/exportCsv";

type FiltersState = {
  applicant?: string;
  patentName?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  status?: PatentStatus | "";
  sort?: "asc" | "desc";
};

export default function PatentSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [filters, setFilters] = useState<FiltersState>({});
  const [selectedPresetId, setSelectedPresetId] = useState("");

  const {
    results,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalCount,
    sortOrder,
    isExporting,
    changeSortOrder,
    filterPatents,
    fetchAllResults,
    retry,
  } = usePatentSearch();

  const { favorites, toggleFavorite } = useFavorites();

  const handleBasicSearch = async (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    const uiFilters = {
      applicant: params.applicant,
      startDate: toInputDateFormat(params.startDate),
      endDate: toInputDateFormat(params.endDate),
    };
    setFilters(uiFilters);
    await filterPatents(
      {
        applicant: params.applicant,
        startDate: toApiDateFormat(params.startDate),
        endDate: toApiDateFormat(params.endDate),
      },
      1
    );
  };

  const handleAdvancedSearch = async (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => {
    const uiFilters = {
      ...params,
      startDate: toInputDateFormat(params.startDate),
      endDate: toInputDateFormat(params.endDate),
    };
    setFilters(uiFilters);
    await filterPatents(
      {
        ...params,
        startDate: toApiDateFormat(params.startDate),
        endDate: toApiDateFormat(params.endDate),
      },
      1
    );
  };

  const handleResetFilters = () => setFilters({});

  const handlePageChange = (page: number) => {
    filterPatents(
      {
        ...filters,
        startDate: toApiDateFormat(filters.startDate),
        endDate: toApiDateFormat(filters.endDate),
      },
      page
    );
  };

  useEffect(() => {
    const state = location.state as
      | { fromSummary?: boolean; filters?: { applicant?: string; startDate?: string; endDate?: string } }
      | undefined;

    if (state?.fromSummary && state.filters) {
      handleBasicSearch({
        applicant: state.filters.applicant || "",
        startDate: toInputDateFormat(state.filters.startDate || ""),
        endDate: toInputDateFormat(state.filters.endDate || ""),
      });
      navigate(".", { replace: true, state: {} });
    }
  }, [location.key]);

  // Active filter chips
  const activeFilters = [
    filters.applicant && { label: `출원인: ${filters.applicant}`, key: "applicant" },
    filters.patentName && { label: `특허명: ${filters.patentName}`, key: "patentName" },
    filters.companyName && { label: `출원인: ${filters.companyName}`, key: "companyName" },
    filters.startDate && filters.endDate && { label: `${filters.startDate} ~ ${filters.endDate}`, key: "date" },
    filters.status && { label: `상태: ${filters.status}`, key: "status" },
  ].filter(Boolean) as Array<{ label: string; key: string }>;

  const handleExportCsv = async () => {
    const allResults = await fetchAllResults();
    const headers = ["출원번호", "발명명칭", "출원인", "출원일", "IPC코드", "상태"];
    const rows = allResults.map((p) => [
      p.applicationNumber,
      p.inventionTitle || "",
      p.applicantName || "",
      toInputDateFormat(p.applicationDate || ""),
      p.mainIpcCode || "",
      p.registerStatus || "",
    ]);
    const applicant = filters.applicant || filters.companyName || filters.patentName || "";
    const parts = ["특허검색결과"];
    if (applicant) parts.push(applicant);
    if (filters.startDate) parts.push(filters.startDate);
    if (filters.endDate) parts.push(filters.endDate);
    downloadCsv(parts.join("_"), headers, rows);
  };

  if (error) {
    return (
      <ProtectedLayout>
        <ErrorState message={error} onRetry={retry} />
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                특허 검색
              </h1>
              <p className="mt-1 text-sm text-gray-500 hidden sm:block">
                KIPRIS 공공데이터 기반 특허 검색
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
          {/* Search Form */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-6">
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-5">
              {[
                { key: "basic", label: "기본 검색", icon: "ri-search-line" },
                { key: "advanced", label: "상세 검색", icon: "ri-equalizer-line" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as "basic" | "advanced")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === key
                      ? "bg-white text-brand-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <i className={`${icon} text-base`} />
                  {label}
                </button>
              ))}
            </nav>

            <div className={activeTab === "basic" ? "block" : "hidden"}>
              <BasicSearch
                onSearch={handleBasicSearch}
                initialValues={filters}
                selectedPresetId={selectedPresetId}
                onPresetChange={setSelectedPresetId}
              />
            </div>
            <div className={activeTab === "advanced" ? "block" : "hidden"}>
              <AdvancedSearch
                onSearch={handleAdvancedSearch}
                onReset={handleResetFilters}
              />
            </div>
          </section>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium">검색 조건:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100"
                >
                  {filter.label}
                </span>
              ))}
            </div>
          )}

          {/* Results */}
          <section>
            {isLoading ? (
              <SkeletonPatentRows count={8} />
            ) : results.length === 0 && totalCount === 0 && !activeFilters.length ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 rounded-full flex items-center justify-center">
                  <i className="ri-search-line text-2xl text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                  검색 조건을 입력하세요
                </h3>
                <p className="text-sm text-gray-500">
                  출원인(회사명), 기간 등 조건을 입력하면 KIPRIS에서 특허를 검색합니다.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-search-line text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                  검색 결과가 없습니다
                </h3>
                <p className="text-sm text-gray-500">
                  다른 조건으로 검색해보세요.
                </p>
              </div>
            ) : (
              <PatentList
                patents={results}
                loading={isLoading}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                sortOrder={sortOrder}
                onSortChange={changeSortOrder}
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                onExportCsv={handleExportCsv}
                isExporting={isExporting}
              />
            )}
          </section>
        </main>
      </div>
    </ProtectedLayout>
  );
}
