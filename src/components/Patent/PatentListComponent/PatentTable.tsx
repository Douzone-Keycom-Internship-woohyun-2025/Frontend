import { getStatusColor } from "../../../utils/statusColor";
import { statusLabel } from "../../../utils/statusLabel";
import { formatDate } from "../../../utils/dateFormat";
import type { PatentListItem } from "../../../types/patent";
import LoadingSpinner from "../../common/LoadingSpinner";
import EmptyState from "../../common/EmptyState";
import { ArrowUpDown, Heart, HeartOff } from "lucide-react";

interface PatentTableProps {
  patents: PatentListItem[];
  loading: boolean;
  favorites: number[];
  onToggleFavorite: (patentId: number) => void;
  sortOrder: "asc" | "desc";
  onSortChange: () => void;
  onPatentClick: (patent: PatentListItem) => void;
  currentPage: number;
}

export default function PatentTable({
  patents,
  loading,
  favorites,
  onToggleFavorite,
  sortOrder,
  onSortChange,
  onPatentClick,
  currentPage,
}: PatentTableProps) {
  if (loading) {
    return <LoadingSpinner message="검색 중입니다..." size="md" />;
  }

  if (patents.length === 0) {
    return (
      <EmptyState
        title="검색 결과가 없습니다"
        description="다른 검색 조건으로 시도해보세요."
        icon="search"
      />
    );
  }

  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayPatents = patents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="w-full">
        {/* ===== 헤더 ===== */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {[
              "출원번호",
              "회사명",
              "특허명",
              "출원일",
              "IPC 분야",
              "상태",
              "관심",
            ].map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header === "출원일" ? (
                  <div className="flex items-center space-x-1">
                    <span>출원일</span>
                    <button
                      onClick={onSortChange}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title={
                        sortOrder === "desc" ? "오름차순 정렬" : "내림차순 정렬"
                      }
                    >
                      <ArrowUpDown
                        className={`w-4 h-4 ${
                          sortOrder === "desc"
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* ===== 본문 ===== */}
        <tbody className="divide-y divide-gray-200">
          {displayPatents.map((patent) => {
            const isFavorite = favorites.includes(patent.applicationNumber);
            return (
              <tr
                key={patent.applicationNumber}
                onClick={() => onPatentClick(patent)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {patent.applicationNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {patent.applicant}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {patent.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatDate(patent.filingDate)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{patent.ipcCodeField}</div>
                  <div className="text-gray-500 text-xs">{patent.ipcCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      patent.status
                    )}`}
                  >
                    {statusLabel[patent.status] || "기타"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(patent.applicationNumber);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={isFavorite ? "관심특허에서 제거" : "관심특허에 추가"}
                  >
                    {isFavorite ? (
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    ) : (
                      <HeartOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
