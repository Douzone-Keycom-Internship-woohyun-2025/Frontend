import { useState } from "react";
import type { PatentListItem, PatentDetail } from "../../../types/patent";
import PatentTable from "./PatentTable";
import Pagination from "./Pagination";
import PatentDetailModal from "../PatentDetail/PatentDetailModal";
import LoadingSpinner from "../../common/LoadingSpinner";
import EmptyState from "../../common/EmptyState";

interface PatentListProps {
  patents: PatentListItem[];
  loading: boolean;
  favorites: string[];
  onToggleFavorite: (applicationNumber: string) => void;
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void;
  currentPage: number;
  totalPages: number;
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
  onPageChange,
}: PatentListProps) {
  const [selectedPatentDetail, setSelectedPatentDetail] =
    useState<PatentDetail | null>(null);

  // 특허 클릭 → 상세정보 백엔드에서 받아온 값 전달하도록 변경해야 함 (해당 부분은 추후 API 연결)
  const handlePatentClick = (patent: PatentListItem) => {
    // ✔ 현재는 PatentDetailModal 구조에 맞게 변환
    const detail: PatentDetail = {
      applicationNumber: patent.applicationNumber,
      inventionTitle: patent.inventionTitle,
      applicantName: patent.applicantName,
      applicationDate: patent.applicationDate,
      mainIpcCode: patent.mainIpcCode,
      ipcKorName: patent.ipcKorName,
      registerStatus: patent.registerStatus,
      isFavorite: patent.isFavorite,
    };
    setSelectedPatentDetail(detail);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortChange(newOrder);
    onPageChange(1);
  };

  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, patents.length);
  const paginatedPatents = patents.slice(startIndex, endIndex);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            검색 결과
          </h3>
          <span className="text-xs sm:text-sm text-gray-500">
            총 {patents.length}건
          </span>
        </div>

        {/* 데스크탑 테이블 */}
        <div className="hidden md:block">
          <PatentTable
            patents={patents}
            loading={loading}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            sortOrder={sortOrder}
            onSortChange={handleSortToggle}
            onPatentClick={handlePatentClick}
            currentPage={currentPage}
          />
        </div>

        {/* 모바일 카드 리스트 */}
        <div className="md:hidden px-4 py-3">
          {loading ? (
            <LoadingSpinner message="검색 중입니다..." size="md" />
          ) : patents.length === 0 ? (
            <EmptyState
              title="검색 결과가 없습니다"
              description="다른 검색 조건으로 시도해보세요."
              icon="search"
            />
          ) : (
            <>
              {/* 정렬 */}
              <div className="flex justify-end mb-3">
                <button
                  onClick={handleSortToggle}
                  className="inline-flex items-center px-2.5 py-1.5 text-[10px] text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <i className="ri-sort-desc text-xs mr-1" />
                  출원일 {sortOrder === "desc" ? "최신순" : "오래된순"}
                </button>
              </div>

              <div className="space-y-3">
                {paginatedPatents.map((patent) => {
                  const isFavorite = favorites.includes(
                    patent.applicationNumber
                  );

                  return (
                    <div
                      key={patent.applicationNumber}
                      onClick={() => handlePatentClick(patent)}
                      className="border border-gray-200 rounded-lg p-3 bg-white shadow-xs flex flex-col gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {/* 상단 */}
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-gray-500 truncate">
                          {patent.applicationNumber}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(patent.applicationNumber);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          {isFavorite ? (
                            <i className="ri-heart-fill text-red-500 text-base" />
                          ) : (
                            <i className="ri-heart-line text-gray-400 text-base" />
                          )}
                        </button>
                      </div>

                      {/* 제목 */}
                      <div className="text-xs font-semibold text-gray-900 line-clamp-2">
                        {patent.inventionTitle}
                      </div>

                      {/* 출원인 */}
                      <div className="text-[10px] text-gray-600">
                        {patent.applicantName}
                      </div>

                      {/* IPC */}
                      <div className="text-[10px] text-gray-500">
                        {patent.ipcKorName} | {patent.mainIpcCode}
                      </div>

                      {/* 날짜 + 상태 */}
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-[10px] text-gray-500">
                          출원일: {patent.applicationDate || "정보 없음"}
                        </div>

                        <span
                          className={`
                            px-2 py-0.5 rounded-full text-[9px] font-medium
                            ${
                              patent.registerStatus === "R"
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : patent.registerStatus === "A"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : "bg-gray-50 text-gray-600 border border-gray-100"
                            }
                          `}
                        >
                          {patent.registerStatus || "상태없음"}
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
                  onPageChange={onPageChange}
                  totalCount={patents.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </>
          )}
        </div>

        {/* 데스크탑 Pagination */}
        <div className="hidden md:block">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalCount={patents.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {selectedPatentDetail && (
        <PatentDetailModal
          patent={selectedPatentDetail}
          isOpen={!!selectedPatentDetail}
          onClose={() => setSelectedPatentDetail(null)}
        />
      )}
    </>
  );
}
