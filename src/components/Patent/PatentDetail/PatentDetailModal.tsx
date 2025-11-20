import type { PatentDetail } from "../../../types/patent";
import { getStatusColor } from "../../../utils/statusColor";
import { formatDate } from "../../../utils/dateFormat";
import LoadingSpinner from "../../common/LoadingSpinner";

interface PatentDetailModalProps {
  patent: PatentDetail | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export default function PatentDetailModal({
  patent,
  isOpen,
  onClose,
  loading,
}: PatentDetailModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const ipcList = patent?.ipcNumber?.split("|").map((ipc) => ipc.trim()) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {loading || !patent ? (
          <div className="p-24 flex justify-center">
            <LoadingSpinner message="상세 정보를 불러오는 중..." size="lg" />
          </div>
        ) : (
          <>
            <div className="sticky top-0 flex justify-between items-center px-6 py-4 border-b bg-white">
              <div className="flex items-center space-x-3">
                <i className="ri-file-text-line text-xl text-blue-600"></i>
                <h2 className="text-xl font-bold text-gray-900">
                  특허 상세정보
                </h2>

                {patent.registerStatus && (
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      patent.registerStatus
                    )}`}
                  >
                    {patent.registerStatus}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="p-8 space-y-10">
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
                  {patent.inventionTitle}
                </h3>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="ri-hashtag mr-2"></i>
                    <span className="font-mono">
                      {patent.applicationNumber}
                    </span>
                  </div>

                  {patent.applicationDate && (
                    <div className="flex items-center">
                      <i className="ri-calendar-line mr-2"></i>
                      <span>{formatDate(patent.applicationDate)}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <i className="ri-building-line mr-2"></i>
                      출원인
                    </label>
                    <p className="text-lg font-medium text-gray-900 ml-6">
                      {patent.applicantName || "정보 없음"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <i className="ri-code-line mr-2"></i>
                      주요 IPC
                    </label>

                    <div className="ml-6">
                      <p className="text-gray-900 font-mono font-bold">
                        {patent.mainIpcCode || "정보 없음"}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {patent.ipcKorName || ""}
                      </p>
                    </div>
                  </div>

                  {ipcList.length > 0 && (
                    <div className="bg-gray-50 p-5 rounded-lg border">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <i className="ri-list-check mr-2"></i>
                        전체 IPC 목록
                      </label>

                      <div className="ml-6 flex flex-wrap gap-2">
                        {ipcList.map((ipc, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-mono"
                          >
                            {ipc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {[
                    {
                      label: "출원일",
                      date: patent.applicationDate,
                      sub: `출원번호: ${patent.applicationNumber}`,
                      icon: "ri-calendar-line",
                    },
                    {
                      label: "공개일",
                      date: patent.openDate,
                      sub: `공개번호: ${patent.openNumber || "정보 없음"}`,
                      icon: "ri-eye-line",
                    },
                    {
                      label: "등록일",
                      date: patent.registerDate,
                      sub: `등록번호: ${patent.registerNumber || "정보 없음"}`,
                      icon: "ri-checkbox-circle-line",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-5 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <i className={`${item.icon} mr-2`}></i>
                          {item.label}
                        </label>

                        <p className="font-bold text-gray-900">
                          {item.date ? formatDate(item.date) : "정보 없음"}
                        </p>
                      </div>

                      <p className="text-xs text-gray-600 ml-6">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </section>

              {patent.astrtCont && (
                <section>
                  <label className="flex items-center text-lg font-bold text-gray-900 mb-3">
                    <i className="ri-file-text-line mr-3 text-blue-600"></i>
                    발명의 요약
                  </label>

                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {patent.astrtCont}
                    </p>
                  </div>
                </section>
              )}

              {patent.drawing && (
                <section>
                  <label className="flex items-center text-lg font-bold text-gray-900 mb-3">
                    <i className="ri-image-line mr-3 text-blue-600"></i>
                    도면 보기
                  </label>

                  <a
                    href={patent.drawing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <i className="ri-image-line text-gray-600 text-lg mr-3"></i>
                    <p className="text-sm text-gray-900 font-semibold">
                      특허 도면 원문 보기
                    </p>
                  </a>
                </section>
              )}

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
