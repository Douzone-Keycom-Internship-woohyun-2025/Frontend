import { memo } from "react";
import { getStatusColor } from "@/utils/statusColor";
import { toInputDateFormat } from "@/utils/dateTransform";
import type { PatentListItem } from "@/types/patent";
import EmptyState from "@/components/common/EmptyState";

interface PatentTableProps {
  patents: PatentListItem[];
  favorites: Set<string>;
  onToggleFavorite: (applicationNumber: string) => void;
  sortOrder: "asc" | "desc";
  onSortChange: () => void;
  onPatentClick: (patent: PatentListItem) => void;
}

export default memo(function PatentTable({
  patents,
  favorites,
  onToggleFavorite,
  sortOrder,
  onSortChange,
  onPatentClick,
}: PatentTableProps) {
  if (patents.length === 0) {
    return (
      <EmptyState
        title="검색 결과가 없습니다"
        description="다른 검색 조건으로 시도해보세요."
        icon="search"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-36">
              출원번호
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-40">
              출원인
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
              발명명칭
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-28">
              <button
                type="button"
                onClick={onSortChange}
                className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
                aria-label={`출원일 ${sortOrder === "desc" ? "내림차순" : "오름차순"} 정렬`}
              >
                출원일
                <i
                  className={`${
                    sortOrder === "desc"
                      ? "ri-arrow-down-s-line"
                      : "ri-arrow-up-s-line"
                  } text-sm`}
                />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-28">
              IPC
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-20">
              상태
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 w-14">
              관심
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {patents.map((patent) => {
            const isFavorite = favorites.has(patent.applicationNumber);
            const statusText = patent.registerStatus || "정보 없음";

            return (
              <tr
                key={patent.applicationNumber}
                onClick={() => onPatentClick(patent)}
                className="hover:bg-brand-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                  {patent.applicationNumber}
                </td>

                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {patent.applicantName || "정보 없음"}
                </td>

                <td className="px-4 py-3 font-medium text-gray-900">
                  <span className="block max-w-xs truncate">
                    {patent.inventionTitle || "정보 없음"}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-600 whitespace-nowrap tabular-nums">
                  {patent.applicationDate
                    ? toInputDateFormat(patent.applicationDate)
                    : "정보 없음"}
                </td>

                <td className="px-4 py-3">
                  <span className="text-gray-700">
                    {patent.mainIpcCode || "-"}
                  </span>
                  {patent.ipcKorName && (
                    <span className="block text-xs text-gray-400 truncate max-w-[7rem]">
                      {patent.ipcKorName}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      statusText
                    )}`}
                  >
                    {statusText}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(patent.applicationNumber);
                    }}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {isFavorite ? (
                      <i className="ri-heart-fill text-red-500 text-base" />
                    ) : (
                      <i className="ri-heart-line text-gray-300 text-base hover:text-gray-400" />
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
});
