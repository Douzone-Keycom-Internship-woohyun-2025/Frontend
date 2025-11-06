import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PatentList from "../components/Patent/PatentListComponent/PatentList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import NoData from "../components/common/NoData";
import { useFavorites } from "../hooks/useFavorites";
import { dummyPatentListResponse } from "../data/dummyPatentListResponse";
import type { PatentListItem } from "../types/patent";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoritePatents, setFavoritePatents] = useState<PatentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 더미데이터에서 관심 특허만 필터링
        const data = dummyPatentListResponse.patents.filter((p) =>
          favorites.includes(p.applicationNumber)
        );

        await new Promise((resolve) => setTimeout(resolve, 400)); // API 대기 시뮬레이션
        setFavoritePatents(data);
      } catch (err) {
        console.error(err);
        setError("관심 특허 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <LoadingSpinner message="관심 특허를 불러오는 중..." size="md" />
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

  if (favoritePatents.length === 0) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <NoData
            message="관심특허가 없습니다."
            subMessage="특허 검색 페이지에서 관심 있는 특허를 추가해보세요."
          />
          <Link
            to="/patent-search"
            className="mt-6 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <i className="ri-search-line text-base mr-2"></i>
            특허 검색하기
          </Link>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900">관심특허</h1>
            <p className="mt-2 text-gray-600">
              관심있는 특허를 모아서 관리하세요
            </p>
          </div>
        </header>

        {/* 리스트 */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <PatentList
            patents={favoritePatents}
            loading={isLoading}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            currentPage={currentPage}
            totalPages={Math.ceil(favoritePatents.length / 20)}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}
