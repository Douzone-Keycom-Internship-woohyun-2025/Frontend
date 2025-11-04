import { useState } from "react";
import type { PatentStatus } from "../types/patent";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import SearchController from "../components/PatentSearch/SearchController";
import QuickSearch from "../components/PatentSearch/QuickSearch";
import PatentList from "../components/PatentSearch/PatentList";

interface SearchQuery {
  patentName: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: "" | PatentStatus;
}

export default function PatentSearchPage() {
  const [query, setQuery] = useState<SearchQuery>({
    patentName: "",
    companyName: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const [quickQuery, setQuickQuery] = useState({
    applicant: "",
    startDate: "",
    endDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "advanced">("quick");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("patent-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState(dummyPatentListResponse);

  const callSearchApi = async (searchParams: any) => {
    setIsLoading(true);
    try {
      // 실제 API:
      // const response = await fetch('/api/patents/search', {...})
      // const data = await response.json()
      // setResults(data)

      // 더미 시뮬레이션
      await new Promise((r) => setTimeout(r, 300));
      setResults(dummyPatentListResponse);
    } catch (e) {
      console.error("검색 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedSearch = (params: SearchQuery) => {
    setQuery(params);
    const searchParams = {
      patentName: params.patentName || undefined,
      companyName: params.companyName || undefined,
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      status: params.status || undefined,
      page: 1,
      pageSize: 20,
    };
    callSearchApi(searchParams);
  };

  const handleQuickSearch = (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => {
    setQuickQuery(params);
    const searchParams = {
      companyName: params.applicant || undefined,
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      page: 1,
      pageSize: 20,
    };
    callSearchApi(searchParams);
  };

  const handleReset = () => {
    if (activeTab === "quick") {
      setQuickQuery({ applicant: "", startDate: "", endDate: "" });
    } else {
      setQuery({
        patentName: "",
        companyName: "",
        startDate: "",
        endDate: "",
        status: "",
      });
    }
    setResults(dummyPatentListResponse);
  };

  const handleToggleFavorite = (applicationNumber: number) => {
    const newFav = favorites.includes(applicationNumber)
      ? favorites.filter((id) => id !== applicationNumber)
      : [...favorites, applicationNumber];
    setFavorites(newFav);
    localStorage.setItem("patent-favorites", JSON.stringify(newFav));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">특허검색</h1>
              <p className="mt-2 text-gray-600">
                특허명, 출원인, 날짜, 상태로 특허를 검색하세요
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
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("quick")}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "quick"
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

        <div className="mb-8">
          {activeTab === "quick" ? (
            <QuickSearch
              onSearch={handleQuickSearch}
              initialParams={quickQuery}
            />
          ) : (
            <SearchController
              onSearch={handleAdvancedSearch}
              onReset={handleReset}
              initialParams={query}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <PatentList
            patents={results.patents}
            loading={isLoading}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </main>
    </div>
  );
}
