import { useState } from "react";
import type { PatentListItem, PatentDetail } from "../../../types/patent";
import { generateDummyDetail } from "../../../data/generateDummyDetail";
import PatentTable from "./PatentTable";
import Pagination from "./Pagination";
import PatentDetailModal from "../PatentDetail/PatentDetailModal";
import LoadingSpinner from "../../common/LoadingSpinner";
import EmptyState from "../../common/EmptyState";

interface PatentListProps {
  patents: PatentListItem[];
  loading: boolean;
  favorites: number[];
  onToggleFavorite: (patentId: number) => void;
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

  const handlePatentClick = (patent: PatentListItem) => {
    const detail = generateDummyDetail(
      patent.applicationNumber,
      patent.title,
      patent.applicant,
      patent.ipcCode,
      patent.status,
      patent.filingDate
    );
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
              {/* 정렬 토글 (출원일 기준) */}
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
                      className="
                        border border-gray-200
                        rounded-lg
                        p-3
                        bg-white
                        shadow-xs
                        flex flex-col gap-1.5
                        hover:bg-gray-50
                        transition-colors
                        cursor-pointer
                      "
                    >
                      {/* 상단: 회사 + 출원번호 */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] text-gray-500 truncate">
                          {patent.applicationNumber}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(patent.applicationNumber);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title={
                            isFavorite ? "관심특허에서 제거" : "관심특허에 추가"
                          }
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
                        {patent.title}
                      </div>

                      {/* 회사명 / IPC */}
                      <div className="text-[10px] text-gray-600">
                        {patent.applicant}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {patent.ipcCodeField} | {patent.ipcCode}
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="text-[10px] text-gray-500">
                          출원일: {patent.filingDate}
                        </div>
                        <span
                          className={`
                            px-2 py-0.5
                            rounded-full
                            text-[9px]
                            font-medium
                            ${/* 기존 status 스타일 유지를 위해 최소한으로 */ ""}
                            ${
                              patent.status === "registered"
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : patent.status === "pending"
                                  ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                                  : "bg-gray-50 text-gray-600 border border-gray-100"
                            }
                          `}
                        >
                          {patent.status}
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
