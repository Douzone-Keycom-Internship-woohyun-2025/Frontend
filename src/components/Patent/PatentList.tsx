import { useState } from "react";
import type { PatentListItem, PatentDetail } from "../../types/patent";
import { getStatusColor } from "../../utils/statusColor";
import { formatDate } from "../../utils/dateFormat";
import { generateDummyDetail } from "../../data/generateDummyDetail"; // ← 추가
import PatentDetailModal from "./PatentDetailModal";

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

  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayPatents = patents.slice(startIndex, endIndex);
  const totalCount = patents.length;

  // ===== 페이지 그룹 계산 =====
  const groupSize = 5;

  const getPageGroup = () => {
    const groupIndex = Math.ceil(currentPage / groupSize);
    const groupStart = (groupIndex - 1) * groupSize + 1;
    const groupEnd = Math.min(totalPages, groupStart + groupSize - 1);
    return { groupStart, groupEnd, groupIndex };
  };

  const { groupStart, groupEnd } = getPageGroup();

  const pageNumbers = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, i) => groupStart + i
  );

  // ===== 테이블 행 클릭 시 상세 데이터 생성 =====
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

  // ===== 조기 반환 =====
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">검색 중...</p>
        </div>
      </div>
    );
  }

  if (patents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-600">다른 검색 조건으로 시도해보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">검색결과</h3>
            <span className="text-sm text-gray-500">총 {totalCount}건</span>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  출원번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회사명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  특허명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>출원일</span>
                    <button
                      onClick={() =>
                        onSortChange(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="p-1 rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                      title={
                        sortOrder === "desc" ? "오름차순 정렬" : "내림차순 정렬"
                      }
                    >
                      <i
                        className={`w-3 h-3 flex items-center justify-center ${
                          sortOrder === "desc"
                            ? "ri-arrow-down-line"
                            : "ri-arrow-up-line"
                        } text-gray-400`}
                      ></i>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IPC 분야
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관심
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {displayPatents.map((patent) => (
                <tr
                  key={patent.applicationNumber}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handlePatentClick(patent)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patent.applicationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patent.applicant}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{patent.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(patent.filingDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{patent.ipcCodeField}</div>
                    <div className="text-gray-500 text-xs">
                      {patent.ipcCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        patent.status
                      )}`}
                    >
                      {patent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(patent.applicationNumber);
                      }}
                      className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
                        favorites.includes(patent.applicationNumber)
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                      title={
                        favorites.includes(patent.applicationNumber)
                          ? "관심특허에서 제거"
                          : "관심특허에 추가"
                      }
                    >
                      <i
                        className={`w-5 h-5 flex items-center justify-center ${
                          favorites.includes(patent.applicationNumber)
                            ? "ri-heart-fill"
                            : "ri-heart-line"
                        }`}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              총 {totalCount}건 중 {startIndex + 1}-
              {Math.min(endIndex, totalCount)}건 표시
            </div>

            <div className="flex items-center space-x-2">
              {/* 처음 */}
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium border rounded disabled:opacity-50"
                title="첫 페이지"
              >
                «
              </button>

              {/* 이전 그룹 */}
              <button
                onClick={() =>
                  onPageChange(Math.max(1, groupStart - groupSize))
                }
                disabled={groupStart === 1}
                className="px-3 py-2 text-sm font-medium border rounded disabled:opacity-50"
                title="이전 그룹"
              >
                ‹
              </button>

              {/* 페이지 번호 */}
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded ${
                    pageNum === currentPage
                      ? "bg-blue-600 text-white"
                      : "border text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* 다음 그룹 */}
              <button
                onClick={() => onPageChange(Math.min(totalPages, groupEnd + 1))}
                disabled={groupEnd >= totalPages}
                className="px-3 py-2 text-sm font-medium border rounded disabled:opacity-50"
                title="다음 그룹"
              >
                ›
              </button>

              {/* 마지막 */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium border rounded disabled:opacity-50"
                title="마지막 페이지"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
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
