import { useState } from "react";
import type { PatentStatus } from "../../types/patent";
import { statusLabel } from "../../utils/statusLabel";

interface AdvancedSearchProps {
  onSearch: (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => void;
  onReset: () => void;
}

export default function AdvancedSearch({
  onSearch,
  onReset,
}: AdvancedSearchProps) {
  const [patentName, setPatentName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 백엔드 규격 : "A" | "C" | "F" | "G" | "I" | "J" | "R" | ""
  const [status, setStatus] = useState<PatentStatus | "">("");

  const handleSearch = () => {
    const params: {
      patentName?: string;
      companyName?: string;
      startDate?: string;
      endDate?: string;
      status?: PatentStatus;
    } = {};

    if (patentName.trim()) params.patentName = patentName.trim();
    if (companyName.trim()) params.companyName = companyName.trim();
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status) params.status = status;

    onSearch(params);
  };

  const handleReset = () => {
    setPatentName("");
    setCompanyName("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">상세 검색</h3>

      <div className="space-y-4">
        {/* 특허명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            특허명 <span className="text-gray-400">(선택)</span>
          </label>
          <input
            type="text"
            placeholder="예: 배터리, 통신, AI"
            value={patentName}
            onChange={(e) => setPatentName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 회사명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            출원인 <span className="text-gray-400">(선택)</span>
          </label>
          <input
            type="text"
            placeholder="예: 삼성전자, LG전자"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 날짜 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 날짜 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상태 <span className="text-gray-400">(선택)</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PatentStatus | "")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="A">{statusLabel["A"]}</option>
            <option value="C">{statusLabel["C"]}</option>
            <option value="F">{statusLabel["F"]}</option>
            <option value="G">{statusLabel["G"]}</option>
            <option value="I">{statusLabel["I"]}</option>
            <option value="J">{statusLabel["J"]}</option>
            <option value="R">{statusLabel["R"]}</option>
          </select>
        </div>
      </div>

      {/* 버튼 */}
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
