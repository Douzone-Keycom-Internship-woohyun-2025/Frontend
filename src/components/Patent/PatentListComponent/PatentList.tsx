import { useState } from "react";
import type { PatentListItem, PatentDetail } from "../../../types/patent";
import PatentTable from "./PatentTable";
import Pagination from "./Pagination";
import PatentDetailModal from "../PatentDetail/PatentDetailModal";
import EmptyState from "../../common/EmptyState";
import { getStatusColor } from "../../../utils/statusColor";
import { getPatentDetail } from "../../../api/patent";

interface FavoritePayload {
  applicationNumber: string;
  inventionTitle: string;
  applicantName: string;
  abstract: string | null;
  applicationDate: string;
  openNumber: string | null;
  publicationNumber: string | null;
  publicationDate: string | null;
  registerNumber: string | null;
  registerDate: string | null;
  registerStatus: string | null;
  drawingUrl: string | null;
  ipcNumber: string | null;
  mainIpcCode: string | null;
}

interface PatentListProps {
  patents: PatentListItem[];
  loading: boolean;
  favorites: string[];
  onToggleFavorite: (
    applicationNumber: string,
    payload?: FavoritePayload
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
      alert("특허 상세 정보를 가져오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  // 즐겨찾기 추가용 payload 생성 (검색 리스트 기반)
  const buildFavoritePayload = (p: PatentListItem): FavoritePayload => ({
    applicationNumber: p.applicationNumber,
    inventionTitle: p.inventionTitle ?? "",
    applicantName: p.applicantName ?? "",
    abstract: null,
    applicationDate: p.applicationDate ?? "",
    openNumber: null,
    publicationNumber: null,
    publicationDate: null,
    registerNumber: null,
    registerDate: null,
    registerStatus: p.registerStatus ?? null,
    drawingUrl: null,
    ipcNumber: null,
    mainIpcCode: p.mainIpcCode ?? null,
  });

  const handleFavoriteToggleMobile = (
    e: React.MouseEvent,
    patent: PatentListItem
  ) => {
    e.stopPropagation();
    onToggleFavorite(patent.applicationNumber, buildFavoritePayload(patent));
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortChange(newOrder);
  };

  const itemsPerPage = 20;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 헤더 */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            검색 결과
          </h3>
          <span className="text-xs sm:text-sm text-gray-500">
            총 {totalCount}건
          </span>
        </div>

        {/* 데스크탑 테이블 */}
        <div className="hidden md:block">
          <PatentTable
            patents={patents}
            favorites={favorites}
            onToggleFavorite={(applicationNumber) => {
              const patent = patents.find(
                (p) => p.applicationNumber === applicationNumber
              );
              if (!patent) return;
              onToggleFavorite(applicationNumber, buildFavoritePayload(patent));
            }}
            sortOrder={sortOrder}
            onSortChange={handleSortToggle}
            onPatentClick={handlePatentClick}
            currentPage={currentPage}
          />
        </div>

        {/* 모바일 카드형 */}
        <div className="md:hidden px-4 py-3">
          {loading ? (
            <></>
          ) : patents.length === 0 ? (
            <EmptyState
              title="검색 결과가 없습니다"
              description="다른 검색 조건으로 시도해보세요."
              icon="search"
            />
          ) : (
            <>
              <div className="flex justify-end mb-3">
                <button
                  onClick={handleSortToggle}
                  className="inline-flex items-center px-2.5 py-1.5 text-[10px] text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === "desc" ? (
                    <>
                      <i className="ri-arrow-down-s-line text-xs mr-1" />
                      최신순
                    </>
                  ) : (
                    <>
                      <i className="ri-arrow-up-s-line text-xs mr-1" />
                      오래된순
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {patents.map((patent) => {
                  const isFavorite = favorites.includes(
                    patent.applicationNumber
                  );

                  return (
                    <div
                      key={patent.applicationNumber}
                      onClick={() => handlePatentClick(patent)}
                      className="border border-gray-200 rounded-lg p-3 bg-white shadow-xs cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-gray-500 truncate">
                          {patent.applicationNumber}
                        </div>

                        {/* 모바일 즐겨찾기 */}
                        <button
                          onClick={(e) => handleFavoriteToggleMobile(e, patent)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          {isFavorite ? (
                            <i className="ri-heart-fill text-red-500 text-base" />
                          ) : (
                            <i className="ri-heart-line text-gray-400 text-base" />
                          )}
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-gray-900 line-clamp-2">
                        {patent.inventionTitle}
                      </div>

                      <div className="text-[10px] text-gray-600">
                        {patent.applicantName}
                      </div>

                      <div className="text-[10px] text-gray-500">
                        {patent.ipcKorName} | {patent.mainIpcCode}
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-[10px] text-gray-500">
                          출원일: {patent.applicationDate || "정보 없음"}
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${getStatusColor(
                            patent.registerStatus || ""
                          )}`}
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
                  totalCount={totalCount}
                  onPageChange={onPageChange}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </>
          )}
        </div>

        {/* 데스크탑 pagination */}
        <div className="hidden md:block">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* 상세 모달 */}
      <PatentDetailModal
        patent={selectedPatentDetail}
        isOpen={detailLoading || !!selectedPatentDetail}
        loading={detailLoading}
        onClose={() => setSelectedPatentDetail(null)}
        isFavorite={favorites.includes(
          selectedPatentDetail?.applicationNumber ?? ""
        )}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
}
