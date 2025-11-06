import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import BasicSearch from "../components/PatentSearch/BasicSearch";
import AdvancedSearch from "../components/PatentSearch/AdvancedSearch";
import PatentList from "../components/Patent/PatentListComponent/PatentList";
import { usePatentSearch } from "../hooks/usePatentSearch";
import { useFavorites } from "../hooks/useFavorites";
import type { PatentStatus } from "../types/patent";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";

type FiltersState = {
  applicant: string;
  patentName: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: PatentStatus | "";
};

export default function PatentSearchPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FiltersState>({
    applicant: "",
    patentName: "",
    companyName: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const { results, isLoading, error, filterPatents } = usePatentSearch();
  const { favorites, toggleFavorite } = useFavorites();

  const handleBasicSearch = async (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    const newFilters: FiltersState = {
      applicant: params.applicant,
      patentName: "",
      companyName: "",
      startDate: params.startDate,
      endDate: params.endDate,
      status: "",
    };
    setFilters(newFilters);
    await filterPatents({ ...newFilters, sortOrder });
    setCurrentPage(1);
  };

  const handleAdvancedSearch = async (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => {
    const newFilters: FiltersState = {
      applicant: "",
      patentName: params.patentName || "",
      companyName: params.companyName || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
      status: params.status || "",
    };
    setFilters(newFilters);
    await filterPatents({ ...newFilters, sortOrder });
    setCurrentPage(1);
  };

  const handleAdvancedReset = () => {
    setFilters({
      applicant: "",
      patentName: "",
      companyName: "",
      startDate: "",
      endDate: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleSortChange = async (order: "asc" | "desc") => {
    setSortOrder(order);
    await filterPatents({ ...filters, sortOrder: order });
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

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
        startDate: state.filters.startDate || "",
        endDate: state.filters.endDate || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  if (isLoading) {
    return (
      <ProtectedLayout>
        <LoadingSpinner message="검색 중입니다..." size="md" />
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
        {/* 상단 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">특허 검색</h1>
              <p className="mt-2 text-gray-600">
                특허명, 출원인, 날짜로 특허를 검색하세요.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              총 {results.length}건의 특허
            </div>
          </div>
        </header>

        {/* 메인 */}
        <main className="px-8 py-8">
          {/* 탭 메뉴 */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-4">
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => {
                  setActiveTab("basic");
                  handleAdvancedReset();
                }}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "basic"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-search-line mr-2"></i>기본 검색
              </button>
              <button
                onClick={() => {
                  setActiveTab("advanced");
                  handleAdvancedReset();
                }}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "advanced"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-settings-3-line mr-2"></i>상세 검색
              </button>
            </nav>
          </div>

          {/* 검색 영역 */}
          <section className="bg-white rounded-lg shadow p-8 mb-10">
            {activeTab === "basic" ? (
              <BasicSearch
                onSearch={handleBasicSearch}
                initialValues={filters}
              />
            ) : (
              <AdvancedSearch
                onSearch={handleAdvancedSearch}
                onReset={handleAdvancedReset}
              />
            )}
          </section>

          {/* 검색 결과 영역 */}
          <section>
            {results.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-search-line text-3xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600">
                  다른 검색 조건으로 시도해보세요.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <PatentList
                  patents={results}
                  loading={isLoading}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  currentPage={currentPage}
                  totalPages={Math.ceil(results.length / 20)}
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
