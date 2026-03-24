import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import PatentList from "@/components/patent/PatentList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { downloadCsv } from "@/utils/exportCsv";

import { useFavorites } from "@/hooks/useFavorites";

import type { PatentListItem, PatentStatus } from "@/types/patent";

const VALID_STATUS: PatentStatus[] = [
  "등록", "공개", "취하", "소멸", "포기", "무효", "거절", "",
];

const sanitizeStatus = (value: string | null | undefined): PatentStatus => {
  if (!value) return "";
  return VALID_STATUS.includes(value as PatentStatus)
    ? (value as PatentStatus)
    : "";
};

export default function FavoritesPage() {
  const {
    favorites,
    favoriteItems,
    toggleFavorite,
    loading,
    error,
    refetch,
    analysis,
    analysisLoading,
  } = useFavorites();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const favoritePatents: PatentListItem[] = useMemo(() => {
    const mapped = favoriteItems.map((item) => ({
      applicationNumber: item.applicationNumber,
      inventionTitle: item.inventionTitle,
      applicantName: item.applicantName,
      applicationDate: item.applicationDate,
      mainIpcCode: item.mainIpcCode ?? undefined,
      ipcKorName: undefined,
      registerStatus: sanitizeStatus(item.registerStatus),
      isFavorite: true,
    }));

    return mapped.sort((a, b) => {
      const dateA = a.applicationDate || "";
      const dateB = b.applicationDate || "";
      return sortOrder === "asc"
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });
  }, [favoriteItems, sortOrder]);

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    const headers = ["출원번호", "발명명칭", "출원인", "출원일", "IPC코드", "상태"];
    const rows = favoritePatents.map((p) => [
      p.applicationNumber,
      p.inventionTitle || "",
      p.applicantName || "",
      p.applicationDate || "",
      p.mainIpcCode || "",
      p.registerStatus || "",
    ]);
    downloadCsv("관심특허", headers, rows);
  };

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
            <div className="flex items-center gap-3">
              {favoritePatents.length > 0 && (
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-download-2-line" />
                  CSV 내보내기
                </button>
              )}
              <div className="hidden md:flex items-center text-gray-500 text-sm">
                <i className="ri-heart-line text-brand-700 mr-2" />
                즐겨찾기 목록
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* 미니 분석 대시보드 */}
          {analysis && !analysisLoading && analysis.totalCount > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
              >
                <i className={`ri-arrow-${showAnalysis ? "down" : "right"}-s-line text-lg`} />
                관심특허 분석 요약
              </button>

              {showAnalysis && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {/* 총 건수 */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">총 관심특허</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analysis.totalCount}건
                    </p>
                  </div>

                  {/* 상위 상태 */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">주요 상태</p>
                    {analysis.statusCounts.length > 0 ? (
                      <div className="space-y-1">
                        {analysis.statusCounts.slice(0, 2).map((s) => (
                          <div key={s.status} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{s.status}</span>
                            <span className="text-sm font-semibold text-gray-900">{s.count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </div>

                  {/* 상위 IPC */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">주요 기술분야</p>
                    {analysis.ipcCounts.length > 0 ? (
                      <div className="space-y-1">
                        {analysis.ipcCounts.slice(0, 2).map((ipc) => (
                          <div key={ipc.ipc_code} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{ipc.ipc_code}</span>
                            <span className="text-sm font-semibold text-gray-900">{ipc.count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </div>

                  {/* IPC 다양성 */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">기술 다양성</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analysis.ipcCounts.length}개
                    </p>
                    <p className="text-xs text-gray-500">IPC 분야</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-lg shadow p-10 flex justify-center">
              <LoadingSpinner message="관심 특허를 불러오는 중..." size="md" />
            </div>
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={refetch}
            />
          ) : favoritePatents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 sm:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                <i className="ri-heart-line text-2xl text-brand-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                관심특허가 없습니다
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                특허 검색 페이지에서 마음에 드는 특허를 즐겨찾기에 추가해보세요.
              </p>

              <Link
                to="/patent-search"
                className="inline-flex items-center px-4 sm:px-5 py-2.5
                  bg-brand-700 text-white text-sm sm:text-base rounded-lg
                  hover:bg-brand-800 transition-colors duration-200"
              >
                <i className="ri-search-line text-base mr-2" />
                특허 검색하기
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
              <PatentList
                patents={favoritePatents}
                loading={loading}
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
