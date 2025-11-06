interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  itemsPerPage,
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
      <div className="text-sm text-gray-500">
        총 {totalCount}건 중 {startIndex + 1}–{endIndex}건 표시
      </div>
      <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
}
