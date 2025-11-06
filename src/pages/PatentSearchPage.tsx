import { useState, useEffect } from "react";
import type { PatentListItem, PatentStatus } from "../types/patent";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import ProtectedLayout from "../layouts/ProtectedLayout";
import BasicSearch from "../components/PatentSearch/BasicSearch";
import AdvancedSearch from "../components/PatentSearch/AdvancedSearch";
import PatentList from "../components/Patent/PatentList";
import { useLocation } from "react-router-dom";

type FiltersState = {
  applicant: string;
  patentName: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: PatentStatus | "";
};

export default function PatentSearchPage() {
  const location = useLocation(); // ✅ 요약분석에서 넘어온 state 확인용
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("patent-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState<FiltersState>({
    applicant: "",
    patentName: "",
    companyName: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const [results, setResults] = useState<PatentListItem[]>([]);

  // 🔹 실제 필터링 함수
  const filterPatents = async (
    params: FiltersState
  ): Promise<PatentListItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let filtered = [...dummyPatentListResponse.patents];

    if (params.applicant.trim()) {
      const app = params.applicant.toLowerCase();
      filtered = filtered.filter((p) =>
        p.applicant.toLowerCase().includes(app)
      );
    }
    if (params.patentName.trim()) {
      const name = params.patentName.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(name));
    }
    if (params.companyName.trim()) {
      const company = params.companyName.toLowerCase();
      filtered = filtered.filter((p) =>
        p.applicant.toLowerCase().includes(company)
      );
    }
    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      filtered = filtered.filter(
        (p) => new Date(p.filingDate).getTime() >= start
      );
    }
    if (params.endDate) {
      const end = new Date(params.endDate).getTime();
      filtered = filtered.filter(
        (p) => new Date(p.filingDate).getTime() <= end
      );
    }
    if (params.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    filtered.sort((a, b) => {
      const timeA = new Date(a.filingDate).getTime();
      const timeB = new Date(b.filingDate).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

    return filtered;
  };

  // 🔹 기본 검색 (async 스타일)
  const handleBasicSearch = async (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const newFilters: FiltersState = {
        applicant: params.applicant,
        patentName: "",
        companyName: "",
        startDate: params.startDate,
        endDate: params.endDate,
        status: "",
      };
      setFilters(newFilters);

      const filtered = await filterPatents(newFilters);
      setResults(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 상세 검색 (async 스타일)
  const handleAdvancedSearch = async (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const newFilters: FiltersState = {
        applicant: "",
        patentName: params.patentName || "",
        companyName: params.companyName || "",
        startDate: params.startDate || "",
        endDate: params.endDate || "",
        status: params.status || "",
      };
      setFilters(newFilters);

      const filtered = await filterPatents(newFilters);
      setResults(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("상세 검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 초기화
  const handleAdvancedReset = () => {
    setFilters({
      applicant: "",
      patentName: "",
      companyName: "",
      startDate: "",
      endDate: "",
      status: "",
    });
    setResults([]);
    setCurrentPage(1);
  };

  // 🔹 정렬
  const handleSortChange = async (order: "asc" | "desc") => {
    setSortOrder(order);
    setIsLoading(true);
    const sorted = await filterPatents(filters);
    setResults(sorted);
    setIsLoading(false);
  };

  // 🔹 즐겨찾기
  const handleToggleFavorite = (patentId: number) => {
    const newFav = favorites.includes(patentId)
      ? favorites.filter((id) => id !== patentId)
      : [...favorites, patentId];
    setFavorites(newFav);
    localStorage.setItem("patent-favorites", JSON.stringify(newFav));
  };

  // 🔹 페이지 이동
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log("📦 location.state:", location.state);

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
      console.log("✅ 요약분석에서 받은 필터:", state.filters); // ✅ 2️⃣ 실제 전달 데이터 확인
      handleBasicSearch({
        applicant: state.filters.applicant || "",
        startDate: state.filters.startDate || "",
        endDate: state.filters.endDate || "",
      });
    } else {
      console.log("⚠️ fromSummary 아님 또는 filters 누락됨");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // ===== 로딩 / 에러 화면 =====
  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm">검색 중입니다...</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white shadow-md p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              검색 실패
            </h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  // ===== 정상 UI =====
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
                  총 {results.length}건의 특허
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
          </div>

          {/* 검색 결과 */}
          {results.length === 0 ? (
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
              patents={results}
              loading={isLoading}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              totalPages={Math.ceil(results.length / 20)}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
