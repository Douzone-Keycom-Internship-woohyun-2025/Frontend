import { useState } from "react";

interface QuickSearchProps {
  onSearch: (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => void;
  initialParams?: {
    applicant: string;
    startDate: string;
    endDate: string;
  };
}

export default function QuickSearch({
  onSearch,
  initialParams,
}: QuickSearchProps) {
  const [applicant, setApplicant] = useState(initialParams?.applicant ?? "");
  const [startDate, setStartDate] = useState(initialParams?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialParams?.endDate ?? "");

  const handleSearch = () => {
    onSearch({
      applicant,
      startDate,
      endDate,
    });
  };

  const handleReset = () => {
    setApplicant("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* 제목 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">기본 검색</h3>

      {/* 검색 폼 (3개 입력창) */}
      <div className="space-y-4">
        {/* 1. 회사명 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            회사명
          </label>
          <input
            type="text"
            placeholder="예: 삼성, LG, 네이버"
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 2. 시작 날짜 입력 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 날짜
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. 종료 날짜 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 날짜
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 버튼 (검색 / 초기화) */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={handleSearch}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          검색
        </button>
        <button
          onClick={handleReset}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
