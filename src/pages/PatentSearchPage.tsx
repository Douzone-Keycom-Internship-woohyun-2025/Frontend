import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import BasicSearch from "../components/PatentSearch/BasicSearch";
import AdvancedSearch from "../components/PatentSearch/AdvancedSearch";
import PatentList from "../components/Patent/PatentListComponent/PatentList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import NoData from "../components/common/NoData";
import { usePatentSearch } from "../hooks/usePatentSearch";
import { useFavorites } from "../hooks/useFavorites";
import type { PatentStatus } from "../types/patent";
import { toApiDateFormat, toInputDateFormat } from "../utils/dateTransform";

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
    changeSortOrder,
    filterPatents,
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

  const handleResetFilters = () => {
    setFilters({});
  };

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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const state = location.state as
      | {
          fromSummary?: boolean;
          filters?: {
            applicant?: string;
            startDate?: string;
            endDate?: string;
          };
        }
      | undefined;

    if (state?.fromSummary && state.filters) {
      handleBasicSearch({
        applicant: state.filters.applicant || "",
        startDate: toInputDateFormat(state.filters.startDate || ""),
        endDate: toInputDateFormat(state.filters.endDate || ""),
      });
    }
  }, [location.pathname, location.search]);

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
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">특허 검색</h1>
            <div className="text-sm text-gray-500">총 {totalCount}건</div>
          </div>
        </header>

        <main className="px-8 py-8">
          <section className="bg-white rounded-lg shadow p-8 mb-10">
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
              {[
                { key: "basic", label: "기본 검색", icon: "ri-search-line" },
                {
                  key: "advanced",
                  label: "상세 검색",
                  icon: "ri-settings-3-line",
                },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as "basic" | "advanced")}
                  className={`px-6 py-3 rounded-md text-sm font-medium ${
                    activeTab === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i className={`${icon} mr-2`} />
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

          <section>
            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-12">
                <LoadingSpinner message="검색 중입니다..." size="md" />
              </div>
            ) : results.length === 0 ? (
              <NoData
                message="검색 결과가 없습니다."
                subMessage="다른 조건으로 검색해보세요."
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
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
                />
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedLayout>
  );
}
