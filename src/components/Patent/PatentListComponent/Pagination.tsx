interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  groupSize?: number; // 기본 5개 묶음
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  itemsPerPage,
  groupSize = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 현재가 속한 그룹 계산
  const currentGroup = Math.ceil(currentPage / groupSize);
  const groupStart = (currentGroup - 1) * groupSize + 1;
  const groupEnd = Math.min(currentGroup * groupSize, totalPages);

  const pages = [];
  for (let i = groupStart; i <= groupEnd; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 border-t bg-gray-50">
      {/* 왼쪽: 범위 표시 */}
      <div className="text-sm text-gray-600 mb-3 sm:mb-0">
        총 {totalCount.toLocaleString()}건 중{" "}
        {(currentPage - 1) * itemsPerPage + 1}–
        {Math.min(currentPage * itemsPerPage, totalCount)}건 표시
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center space-x-1">
        {/* 이전 그룹 */}
        <button
          disabled={groupStart === 1}
          onClick={() => onPageChange(groupStart - 1)}
          className={`min-w-[32px] h-8 flex items-center justify-center rounded border text-sm transition
            ${
              groupStart === 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
        </button>

        {/* 페이지 번호 */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded text-sm border transition
              ${
                p === currentPage
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        ))}

        {/* 다음 그룹 */}
        <button
          disabled={groupEnd === totalPages}
          onClick={() => onPageChange(groupEnd + 1)}
          className={`min-w-[32px] h-8 flex items-center justify-center rounded border text-sm transition
            ${
              groupEnd === totalPages
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
        >
          <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
