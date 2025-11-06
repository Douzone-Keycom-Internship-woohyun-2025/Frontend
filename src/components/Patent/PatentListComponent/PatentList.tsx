import { useState } from "react";
import type { PatentListItem, PatentDetail } from "../../../types/patent";
import { generateDummyDetail } from "../../../data/generateDummyDetail";
import PatentTable from "./PatentTable";
import Pagination from "./Pagination";
import PatentDetailModal from "../PatentDetail/PatentDetailModal";

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

  const handleSortChange = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortChange(newOrder);
    onPageChange(1);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between">
          <h3 className="text-lg font-semibold text-gray-900">검색 결과</h3>
          <span className="text-sm text-gray-500">총 {patents.length}건</span>
        </div>

        <PatentTable
          patents={patents}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onPatentClick={handlePatentClick}
          currentPage={currentPage}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalCount={patents.length}
          itemsPerPage={20}
        />
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
