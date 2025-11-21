import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PatentList from "../components/Patent/PatentListComponent/PatentList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";

import { useFavorites } from "../hooks/useFavorites";
import { getFavoritesApi } from "../api/favorite";

import type { PatentListItem, PatentStatus } from "../types/patent";
import type { FavoriteItem } from "../types/favorite";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoritePatents, setFavoritePatents] = useState<PatentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // 👉 여기서 TS 타입 정확히 맞게 sanitize
  const VALID_STATUS: PatentStatus[] = [
    "등록",
    "공개",
    "취하",
    "소멸",
    "포기",
    "무효",
    "거절",
    "",
  ];

  const sanitizeStatus = (value: string | null | undefined): PatentStatus => {
    if (!value) return "";
    return VALID_STATUS.includes(value as PatentStatus)
      ? (value as PatentStatus)
      : "";
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    async function loadFavorites() {
      try {
        setError(null);
        setIsLoading(true);

        const { favorites: list } = await getFavoritesApi();

        const mapped: PatentListItem[] = list.map((item: FavoriteItem) => ({
          applicationNumber: item.applicationNumber,
          inventionTitle: item.inventionTitle,
          applicantName: item.applicantName,
          applicationDate: item.applicationDate,
          mainIpcCode: item.mainIpcCode ?? undefined,
          ipcKorName: undefined,
          registerStatus: sanitizeStatus(item.registerStatus),
          isFavorite: true,
        }));

        setFavoritePatents(mapped);
      } catch (err) {
        console.error(err);
        setError("관심 특허 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

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

  return (
    <ProtectedLayout>
      <div className="w-full bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                관심특허
              </h1>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                관심 있는 특허를 모아 효율적으로 관리하세요.
              </p>
            </div>
            <div className="hidden md:flex items-center text-gray-500 text-sm">
              <i className="ri-heart-line text-blue-600 mr-2" />
              즐겨찾기 목록
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {favoritePatents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 sm:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-heart-line text-2xl text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                관심특허가 없습니다
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                특허 검색 페이지에서 마음에 드는 특허를 즐겨찾기에 추가해보세요.
              </p>
              <Link
                to="/patent-search"
                className="
                  inline-flex items-center
                  px-4 sm:px-5 py-2.5
                  bg-blue-600 text-white
                  text-sm sm:text-base
                  rounded-lg
                  hover:bg-blue-700
                  transition-colors duration-200"
              >
                <i className="ri-search-line text-base mr-2" />
                특허 검색하기
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
              <PatentList
                patents={favoritePatents}
                loading={isLoading}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                currentPage={currentPage}
                totalPages={Math.ceil(favoritePatents.length / 20)}
                totalCount={favoritePatents.length}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
