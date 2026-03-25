import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import PatentList from "@/components/patent/PatentList";
import { SkeletonPatentRows } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import { downloadCsv } from "@/utils/exportCsv";
import { toInputDateFormat } from "@/utils/dateTransform";

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
    updateMemo,
    loading,
    error,
    refetch,
    analysis,
    analysisLoading,
  } = useFavorites();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

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
    const headers = ["출원번호", "발명명칭", "출원인", "출원일", "IPC코드", "상태", "메모"];
    const rows = favoriteItems.map((item) => [
      item.applicationNumber,
      item.inventionTitle || "",
      item.applicantName || "",
      toInputDateFormat(item.applicationDate || ""),
      item.mainIpcCode || "",
      item.registerStatus || "",
      item.memo || "",
    ]);
    downloadCsv("관심특허", headers, rows);
  };

  // Derived stats for header strip
  const memoCount = useMemo(
    () => favoriteItems.filter((f) => f.memo && f.memo.trim().length > 0).length,
    [favoriteItems]
  );
  const registeredCount = useMemo(
    () => favoriteItems.filter((f) => f.registerStatus === "등록").length,
    [favoriteItems]
  );

  const hasData = !loading && !error && favoritePatents.length > 0;
  const showAnalysis = !analysisLoading && analysis && analysis.totalCount > 0;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* ── Header ── */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 bg-brand-700 rounded-md flex items-center justify-center">
                    <i className="ri-heart-fill text-white text-sm" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    관심특허
                  </h1>
                </div>
                <p className="text-sm text-gray-500 ml-[38px]">
                  저장한 특허를 관리하고 분석하세요
                </p>

                {/* Inline stat strip */}
                {hasData && (
                  <div className="flex flex-wrap items-center gap-1 mt-3 ml-[38px]">
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                      총 {favoritePatents.length}건
                    </span>
                    <span className="text-gray-200 text-xs mx-0.5">|</span>
                    <span className="text-xs text-gray-500 px-2 py-1">
                      등록 <span className="font-semibold text-gray-700">{registeredCount}</span>건
                    </span>
                    {memoCount > 0 && (
                      <>
                        <span className="text-gray-200 text-xs mx-0.5">|</span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 px-2 py-1">
                          <i className="ri-sticky-note-line text-amber-400" />
                          메모 <span className="font-semibold text-gray-700">{memoCount}</span>건
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4">
          {/* ── Analysis strip ── */}
          {showAnalysis && (
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5 text-sm">
                <i className="ri-bar-chart-2-line text-brand-600 text-base" />
                <span className="text-gray-500">총 관심특허</span>
                <span className="font-bold text-gray-900">{analysis.totalCount}건</span>
              </div>

              {analysis.statusCounts.slice(0, 2).map((s) => {
                const dot =
                  s.status === "등록" ? "bg-green-400"
                  : s.status === "공개" ? "bg-blue-400"
                  : ["소멸", "취하", "포기", "무효", "거절"].includes(s.status) ? "bg-gray-300"
                  : "bg-gray-300";
                return (
                  <div key={s.status} className="flex items-center gap-1.5 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                    <span className="text-gray-500">{s.status}</span>
                    <span className="font-semibold text-gray-800">{s.count}건</span>
                  </div>
                );
              })}

              {analysis.ipcCounts.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm ml-auto">
                  <span className="text-gray-400 text-xs">최다 기술분야</span>
                  <span className="font-mono text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {analysis.ipcCounts[0].ipc_code}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Content ── */}
          {loading ? (
            <SkeletonPatentRows count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : favoritePatents.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 sm:p-16 text-center">
              <div className="w-14 h-14 mx-auto mb-5 bg-gray-100 rounded-xl flex items-center justify-center">
                <i className="ri-heart-line text-2xl text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                저장된 관심특허가 없습니다
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                특허 검색 결과에서 하트를 눌러 관심 특허를 저장하면 여기서 모아볼 수 있습니다.
              </p>
              <Link
                to="/patent-search"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-700 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors"
              >
                <i className="ri-search-line" />
                특허 검색하기
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-5 pt-4 pb-0">
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
                  onExportCsv={handleExportCsv}
                  favoriteItems={favoriteItems}
                  onMemoSave={updateMemo}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
