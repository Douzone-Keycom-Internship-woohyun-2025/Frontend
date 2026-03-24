import { useState } from "react";
import type { PatentListItem, PatentDetail } from "@/types/patent";
import type { AddFavoritePayload } from "@/types/favorite";
import { buildFavoritePayloadFromList } from "@/utils/favoritePayload";
import PatentTable from "./PatentTable";
import Pagination from "./Pagination";
import PatentDetailModal from "./PatentDetailModal";
import EmptyState from "@/components/common/EmptyState";
import { getStatusColor } from "@/utils/statusColor";
import { getPatentDetail } from "@/api/patent";
import { toast } from "@/hooks/use-toast";

interface PatentListProps {
  patents: PatentListItem[];
  loading: boolean;
  favorites: Set<string>;
  onToggleFavorite: (
    applicationNumber: string,
    payload?: AddFavoritePayload
  ) => void;
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function PatentList({
  patents,
  loading,
  favorites,
  onToggleFavorite,
  sortOrder,
  onSortChange,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: PatentListProps) {
  const [selectedPatentDetail, setSelectedPatentDetail] =
    useState<PatentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 상세 정보 모달 열기
  const handlePatentClick = async (patent: PatentListItem) => {
    setSelectedPatentDetail(null);
    setDetailLoading(true);

    try {
      const detail = await getPatentDetail(patent.applicationNumber);
      setSelectedPatentDetail(detail);
    } catch {
      toast({ title: "상세 정보 로드 실패", description: "잠시 후 다시 시도해주세요.", variant: "destructive" });
    } finally {
      setDetailLoading(false);
    }
  };


  const handleFavoriteToggleMobile = (
    e: React.MouseEvent,
    patent: PatentListItem
  ) => {
    e.stopPropagation();
    onToggleFavorite(patent.applicationNumber, buildFavoritePayloadFromList(patent));
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortChange(newOrder);
  };

  const itemsPerPage = 20;

  /** Map status color classes to a left-border accent color for mobile cards */
  const getStatusBorderColor = (status: string): string => {
    const color = getStatusColor(status);
    if (color.includes("green")) return "border-l-green-400";
    if (color.includes("brand")) return "border-l-brand-400";
    if (color.includes("yellow")) return "border-l-yellow-400";
    if (color.includes("red")) return "border-l-red-400";
    if (color.includes("purple")) return "border-l-purple-400";
    return "border-l-gray-300";
  };

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">검색 결과</h3>
          <span className="text-xs text-gray-400 tabular-nums">
            {totalCount.toLocaleString()}건
          </span>
        </div>
      </div>

      {/* 데스크탑 테이블 */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm">
        <PatentTable
          patents={patents}
          favorites={favorites}
          onToggleFavorite={(applicationNumber) => {
            const patent = patents.find(
              (p) => p.applicationNumber === applicationNumber
            );
            if (!patent) return;
            onToggleFavorite(applicationNumber, buildFavoritePayloadFromList(patent));
          }}
          sortOrder={sortOrder}
          onSortChange={handleSortToggle}
          onPatentClick={handlePatentClick}
        />
      </div>

      {/* 모바일 카드형 */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <i className="ri-loader-4-line text-2xl animate-spin mb-2" />
            <span className="text-sm">불러오는 중...</span>
          </div>
        ) : patents.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다"
            description="다른 검색 조건으로 시도해보세요."
            icon="search"
          />
        ) : (
          <>
            {/* 모바일 정렬 토글 */}
            <div className="flex justify-end mb-3">
              <button
                onClick={handleSortToggle}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <i
                  className={
                    sortOrder === "desc"
                      ? "ri-arrow-down-s-line text-sm"
                      : "ri-arrow-up-s-line text-sm"
                  }
                />
                {sortOrder === "desc" ? "최신순" : "오래된순"}
              </button>
            </div>

            <div className="space-y-2.5">
              {patents.map((patent) => {
                const isFavorite = favorites.has(patent.applicationNumber);
                const statusText = patent.registerStatus || "상태없음";

                return (
                  <div
                    key={patent.applicationNumber}
                    onClick={() => handlePatentClick(patent)}
                    className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm cursor-pointer
                      border-l-[3px] ${getStatusBorderColor(statusText)}
                      active:bg-gray-50 transition-colors`}
                  >
                    {/* 상단: 출원번호 + 즐겨찾기 */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400 font-mono">
                        {patent.applicationNumber}
                      </span>

                      <button
                        onClick={(e) => handleFavoriteToggleMobile(e, patent)}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {isFavorite ? (
                          <i className="ri-heart-fill text-red-500 text-lg" />
                        ) : (
                          <i className="ri-heart-line text-gray-300 text-lg" />
                        )}
                      </button>
                    </div>

                    {/* 제목 */}
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                      {patent.inventionTitle}
                    </h4>

                    {/* 출원인 */}
                    <p className="text-xs text-gray-600 mb-0.5">
                      {patent.applicantName}
                    </p>

                    {/* IPC */}
                    <p className="text-xs text-gray-400">
                      {patent.ipcKorName} | {patent.mainIpcCode}
                    </p>

                    {/* 하단: 출원일 + 상태 */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400 tabular-nums">
                        출원일: {patent.applicationDate || "정보 없음"}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(
                          statusText
                        )}`}
                      >
                        {statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={onPageChange}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </>
        )}
      </div>

      {/* 데스크탑 pagination */}
      <div className="hidden md:block mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* 상세 모달 */}
      <PatentDetailModal
        patent={selectedPatentDetail}
        isOpen={detailLoading || !!selectedPatentDetail}
        loading={detailLoading}
        onClose={() => {
          setSelectedPatentDetail(null);
          setDetailLoading(false);
        }}
        isFavorite={favorites.has(
          selectedPatentDetail?.applicationNumber ?? ""
        )}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
}
