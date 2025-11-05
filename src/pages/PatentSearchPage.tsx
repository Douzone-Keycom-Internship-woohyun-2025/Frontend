import { useState } from "react";
import type { PatentListItem, PatentStatus } from "../types/patent";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import ProtectedLayout from "../layouts/ProtectedLayout";
import BasicSearch from "../components/PatentSearch/BasicSearch";
import AdvancedSearch from "../components/PatentSearch/AdvancedSearch";
import PatentList from "../components/Patent/PatentList";

export default function PatentSearchPage() {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("patent-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // ===== 필터링 상태 =====
  const [filters, setFilters] = useState({
    applicant: "",
    patentName: "",
    companyName: "",
    startDate: "",
    endDate: "",
    status: "" as PatentStatus | "",
  });

  // ===== 필터링 로직 =====
  const getFilteredPatents = (): PatentListItem[] => {
    let filtered = [...dummyPatentListResponse.patents];

    // 기본 검색 - 회사명 + 날짜
    if (activeTab === "basic") {
      if (filters.applicant.trim()) {
        const app = filters.applicant.toLowerCase();
        filtered = filtered.filter((p) =>
          p.applicant.toLowerCase().includes(app)
        );
      }

      if (filters.startDate) {
        const startTime = new Date(filters.startDate).getTime();
        filtered = filtered.filter(
          (p) => new Date(p.filingDate).getTime() >= startTime
        );
      }

      if (filters.endDate) {
        const endTime = new Date(filters.endDate).getTime();
        filtered = filtered.filter(
          (p) => new Date(p.filingDate).getTime() <= endTime
        );
      }
    }

    // 상세 검색
    if (activeTab === "advanced") {
      if (filters.patentName.trim()) {
        const name = filters.patentName.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(name));
      }

      if (filters.companyName.trim()) {
        const company = filters.companyName.toLowerCase();
        filtered = filtered.filter((p) =>
          p.applicant.toLowerCase().includes(company)
        );
      }

      if (filters.startDate) {
        const startTime = new Date(filters.startDate).getTime();
        filtered = filtered.filter(
          (p) => new Date(p.filingDate).getTime() >= startTime
        );
      }

      if (filters.endDate) {
        const endTime = new Date(filters.endDate).getTime();
        filtered = filtered.filter(
          (p) => new Date(p.filingDate).getTime() <= endTime
        );
      }

      if (filters.status) {
        filtered = filtered.filter((p) => p.status === filters.status);
      }
    }

    return filtered;
  };

  const filteredPatents = getFilteredPatents();
  const totalResults = filteredPatents.length;

  // ===== 기본 검색 핸들러 =====
  const handleBasicSearch = (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    setFilters({
      applicant: params.applicant,
      patentName: "",
      companyName: "",
      startDate: params.startDate,
      endDate: params.endDate,
      status: "",
    });
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // ===== 상세 검색 핸들러 =====
  const handleAdvancedSearch = (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => {
    setFilters({
      applicant: "",
      patentName: params.patentName || "",
      companyName: params.companyName || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
      status: params.status || "",
    });
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // ===== 상세 검색 초기화 =====
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

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleFavorite = (patentId: number) => {
    const newFav = favorites.includes(patentId)
      ? favorites.filter((id) => id !== patentId)
      : [...favorites, patentId];

    setFavorites(newFav);
    localStorage.setItem("patent-favorites", JSON.stringify(newFav));
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 ml-64">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">특허검색</h1>
                <p className="mt-2 text-gray-600">
                  특허명, 출원인, 날짜로 특허를 검색하세요
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  총 {totalResults}건의 특허
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* 탭 메뉴 */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
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
            </div>
          </div>

          {/* 검색 폼 */}
          <div className="mb-8">
            {activeTab === "basic" ? (
              <BasicSearch onSearch={handleBasicSearch} />
            ) : (
              <AdvancedSearch
                onSearch={handleAdvancedSearch}
                onReset={handleAdvancedReset}
              />
            )}
          </div>

          {/* 검색 결과 */}
          {filteredPatents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <i className="ri-search-line text-5xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600">다른 검색 조건으로 시도해보세요</p>
              </div>
            </div>
          ) : (
            <PatentList
              patents={filteredPatents}
              loading={isLoading}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredPatents.length / 20)}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
