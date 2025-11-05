import { useState } from "react";
import type { PatentStatus } from "../types/patent";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import ProtectedLayout from "../layouts/ProtectedLayout";
import BasicSearch from "../components/PatentSearch/BasicSearch";
import AdvancedSearch from "../components/PatentSearch/AdvancedSearch";
import PatentList from "../components/Patent/PatentList";

export default function PatentSearchPage() {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(dummyPatentListResponse);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("patent-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const handleBasicSearch = (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    console.log("기본 검색:", params);
    setIsLoading(true);
    setCurrentPage(1);

    setTimeout(() => {
      setResults(dummyPatentListResponse);
      setIsLoading(false);
    }, 500);
  };

  const handleAdvancedSearch = (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => {
    console.log("상세 검색:", params);
    setIsLoading(true);
    setCurrentPage(1);

    setTimeout(() => {
      setResults(dummyPatentListResponse);
      setIsLoading(false);
    }, 500);
  };

  const handleAdvancedReset = () => {
    console.log("상세 검색 초기화됨");
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
    console.log("정렬 순서:", order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("페이지 변경:", page);
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
                  총 {results.total}건의 특허
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
                onClick={() => setActiveTab("basic")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "basic"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-search-line mr-2"></i>기본 검색
              </button>
              <button
                onClick={() => setActiveTab("advanced")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
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
          {results.patents.length === 0 ? (
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
              patents={results.patents}
              loading={isLoading}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              totalPages={Math.ceil(results.total / 20)}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
