import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PatentList from "../components/Patent/PatentList";
import type { PatentListItem } from "../types/patent";

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoritePatents, setFavoritePatents] = useState<PatentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const saved = localStorage.getItem("patent-favorites");
        const ids: number[] = saved ? JSON.parse(saved) : [];
        setFavoriteIds(ids);

        const data = dummyPatentListResponse.patents.filter((p) =>
          ids.includes(p.applicationNumber)
        );

        await new Promise((resolve) => setTimeout(resolve, 400));

        setFavoritePatents(data);
      } catch (err) {
        console.error(err);
        setError("관심 특허 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = (patentId: number) => {
    const newFavs = favoriteIds.includes(patentId)
      ? favoriteIds.filter((id) => id !== patentId)
      : [...favoriteIds, patentId];

    setFavoriteIds(newFavs);
    localStorage.setItem("patent-favorites", JSON.stringify(newFavs));

    setFavoritePatents((prev) =>
      prev.filter((p) => newFavs.includes(p.applicationNumber))
    );
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm">관심 특허를 불러오는 중...</p>
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
              로딩 실패
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

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 ml-64">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">관심특허</h1>
                <p className="mt-2 text-gray-600">
                  관심있는 특허를 모아서 관리하세요
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {favoritePatents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full">
                <i className="ri-heart-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                관심특허가 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                특허 검색에서 관심있는 특허를 추가해보세요
              </p>
              <Link
                to="/patent-search"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-search-line w-4 h-4 flex items-center justify-center mr-2"></i>
                특허 검색하기
              </Link>
            </div>
          ) : (
            <PatentList
              patents={favoritePatents}
              loading={isLoading}
              favorites={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              totalPages={Math.ceil(favoritePatents.length / 20)}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
