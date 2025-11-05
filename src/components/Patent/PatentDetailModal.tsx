import type { PatentDetail } from "../../types/patent";
import { getStatusColor } from "../../utils/statusColor";
import { formatDate } from "../../utils/dateFormat";

interface PatentDetailModalProps {
  patent: PatentDetail;
  isOpen: boolean;
  onClose: () => void;
}

export default function PatentDetailModal({
  patent,
  isOpen,
  onClose,
}: PatentDetailModalProps) {
  if (!isOpen || !patent) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <i className="ri-file-text-line w-6 h-6 flex items-center justify-center text-gray-600"></i>
              <h2 className="text-xl font-bold text-gray-900">특허 상세정보</h2>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                patent.status
              )}`}
            >
              {patent.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-8">
          {/* 특허명 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 leading-relaxed mb-4">
              {patent.title}
            </h3>
            <div className="flex items-center space-x-6 text-sm text-gray-600 flex-wrap gap-4">
              <div className="flex items-center">
                <i className="ri-hashtag w-4 h-4 flex items-center justify-center mr-2"></i>
                <span className="font-mono">{patent.applicationNumber}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-calendar-line w-4 h-4 flex items-center justify-center mr-2"></i>
                <span>{formatDate(patent.filingDate)}</span>
              </div>
            </div>
          </div>

          {/* 기본 정보 (2단: 왼쪽 출원인/IPC, 오른쪽 3개 날짜) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 출원인 + IPC */}
            <div className="space-y-6">
              {/* 출원인 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <i className="ri-building-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  출원인
                </label>
                <p className="text-gray-900 font-medium text-lg ml-6">
                  {patent.applicant}
                </p>
              </div>

              {/* 주요 IPC */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <i className="ri-code-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  주요 IPC
                </label>
                <div className="ml-6 space-y-1">
                  <p className="text-gray-900 font-mono font-bold">
                    {patent.ipcMain}
                  </p>
                  <p className="text-gray-600 text-sm">{patent.ipcMainField}</p>
                </div>
              </div>
            </div>

            {/* 오른쪽: 3개 날짜 (세로 배열) */}
            <div className="space-y-4">
              {/* 출원일 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <i className="ri-calendar-line w-4 h-4 flex items-center justify-center mr-2"></i>
                    출원일
                  </label>
                  <p className="text-gray-900 font-bold">
                    {formatDate(patent.filingDate)}
                  </p>
                </div>
                {patent.applicationNumber && (
                  <p className="text-gray-600 text-xs ml-6">
                    출원번호: {patent.applicationNumber}
                  </p>
                )}
              </div>

              {/* 공개일 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center mr-2"></i>
                    공개일
                  </label>
                  <p className="text-gray-900 font-bold">
                    {patent.openDate ? formatDate(patent.openDate) : "미공개"}
                  </p>
                </div>
                {patent.openNumber && (
                  <p className="text-gray-600 text-xs ml-6">
                    공개번호: {patent.openNumber}
                  </p>
                )}
              </div>

              {/* 등록일 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center mr-2"></i>
                    등록일
                  </label>
                  <p className="text-gray-900 font-bold">
                    {patent.registerDate
                      ? formatDate(patent.registerDate)
                      : "미등록"}
                  </p>
                </div>
                {patent.registerNumber && (
                  <p className="text-gray-600 text-xs ml-6">
                    등록번호: {patent.registerNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 발행일 (있으면만 표시) */}
          {patent.publicationDate && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <i className="ri-file-list-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  발행일
                </label>
                <p className="text-gray-900 font-bold">
                  {formatDate(patent.publicationDate)}
                </p>
              </div>
              {patent.publicationNumber && (
                <p className="text-gray-600 text-xs ml-6">
                  발행번호: {patent.publicationNumber}
                </p>
              )}
            </div>
          )}

          {/* 모든 IPC */}
          {patent.ipcAll && patent.ipcAll.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
                <i className="ri-list-check w-4 h-4 flex items-center justify-center mr-2"></i>
                전체 IPC 분류
              </label>
              <div className="flex flex-wrap gap-3">
                {patent.ipcAll.map((ipc, idx) => (
                  <div key={idx} className="flex flex-col items-start">
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
                      {ipc}
                    </span>
                    {patent.ipcAllFields && patent.ipcAllFields[idx] && (
                      <span className="text-xs text-gray-600 mt-1">
                        {patent.ipcAllFields[idx]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 초록 */}
          {patent.abstract && (
            <div>
              <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                <i className="ri-file-text-line w-5 h-5 flex items-center justify-center mr-3"></i>
                발명의 요약
              </label>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base">
                  {patent.abstract}
                </p>
              </div>
            </div>
          )}

          {/* 도면 */}
          {(patent.bigDrawing || patent.drawing) && (
            <div>
              <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                <i className="ri-image-line w-5 h-5 flex items-center justify-center mr-3"></i>
                도면
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 주도면 */}
                {patent.bigDrawing && (
                  <a
                    href={patent.bigDrawing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="ri-image-add-line w-5 h-5 text-gray-600"></i>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-900">
                          주도면 보기
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          주요 도면을 확인할 수 있습니다
                        </p>
                      </div>
                      <i className="ri-external-link-line w-4 h-4 text-gray-400"></i>
                    </div>
                  </a>
                )}

                {/* 도면 */}
                {patent.drawing && (
                  <a
                    href={patent.drawing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="ri-image-line w-5 h-5 text-gray-600"></i>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-900">
                          전체 도면 보기
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          특허청 원문에서 도면을 확인합니다
                        </p>
                      </div>
                      <i className="ri-external-link-line w-4 h-4 text-gray-400"></i>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 닫기 */}
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer font-medium"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
