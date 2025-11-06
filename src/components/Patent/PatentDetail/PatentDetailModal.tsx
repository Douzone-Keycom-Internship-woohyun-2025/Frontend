import type { PatentDetail } from "../../../types/patent";
import { getStatusColor } from "../../../utils/statusColor";
import { formatDate } from "../../../utils/dateFormat";

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
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* 헤더 */}
        <div className="sticky top-0 flex justify-between items-center px-6 py-4 border-b bg-white">
          <div className="flex items-center space-x-3">
            <i className="ri-file-text-line text-xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-gray-900">특허 상세정보</h2>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                patent.status
              )}`}
            >
              {patent.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-8 space-y-10">
          {/* 제목 및 기본 정보 */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
              {patent.title}
            </h3>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <i className="ri-hashtag mr-2"></i>
                <span className="font-mono">{patent.applicationNumber}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-calendar-line mr-2"></i>
                <span>{formatDate(patent.filingDate)}</span>
              </div>
            </div>
          </section>

          {/* 기본 정보 (2단 구성) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽 */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-lg border">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <i className="ri-building-line mr-2"></i>출원인
                </label>
                <p className="text-lg font-medium text-gray-900 ml-6">
                  {patent.applicant}
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <i className="ri-code-line mr-2"></i>주요 IPC
                </label>
                <div className="ml-6">
                  <p className="text-gray-900 font-mono font-bold">
                    {patent.ipcMain}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {patent.ipcMainField}
                  </p>
                </div>
              </div>
            </div>

            {/* 오른쪽 날짜 3종 */}
            <div className="space-y-5">
              {[
                {
                  label: "출원일",
                  icon: "ri-calendar-line",
                  date: patent.filingDate,
                  sub: `출원번호: ${patent.applicationNumber || "정보 없음"}`,
                },
                {
                  label: "공개일",
                  icon: "ri-eye-line",
                  date: patent.openDate,
                  sub: `공개번호: ${patent.openNumber || "정보 없음"}`,
                },
                {
                  label: "등록일",
                  icon: "ri-checkbox-circle-line",
                  date: patent.registerDate,
                  sub: `등록번호: ${patent.registerNumber || "정보 없음"}`,
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

          {/* 발행 정보 */}
          {patent.publicationDate && (
            <section className="bg-gray-50 p-5 rounded-lg border">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <i className="ri-file-list-line mr-2"></i>발행일
              </label>
              <div className="flex justify-between items-center">
                <p className="text-gray-900 font-bold">
                  {formatDate(patent.publicationDate)}
                </p>
                {patent.publicationNumber && (
                  <p className="text-xs text-gray-600">
                    발행번호: {patent.publicationNumber}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* 전체 IPC */}
          {patent.ipcAll?.length > 0 && (
            <section className="bg-gray-50 p-5 rounded-lg border">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
                <i className="ri-list-check mr-2"></i>전체 IPC 분류
              </label>
              <div className="flex flex-wrap gap-3">
                {patent.ipcAll.map((ipc, idx) => (
                  <div key={idx} className="flex flex-col items-start">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {ipc}
                    </span>
                    {patent.ipcAllFields?.[idx] && (
                      <span className="text-xs text-gray-600 mt-1">
                        {patent.ipcAllFields[idx]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 발명의 요약 */}
          {patent.abstract && (
            <section>
              <label className="flex items-center text-lg font-bold text-gray-900 mb-3">
                <i className="ri-file-text-line mr-3 text-blue-600"></i>
                발명의 요약
              </label>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {patent.abstract}
                </p>
              </div>
            </section>
          )}

          {/* 도면 */}
          {(patent.bigDrawing || patent.drawing) && (
            <section>
              <label className="flex items-center text-lg font-bold text-gray-900 mb-3">
                <i className="ri-image-line mr-3 text-blue-600"></i>
                도면
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "주도면 보기",
                    desc: "주요 도면을 확인할 수 있습니다",
                    href: patent.bigDrawing,
                    icon: "ri-image-add-line",
                  },
                  {
                    label: "전체 도면 보기",
                    desc: "특허청 원문에서 전체 도면을 확인합니다",
                    href: patent.drawing,
                    icon: "ri-image-line",
                  },
                ]
                  .filter((i) => i.href)
                  .map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <i
                        className={`${item.icon} text-gray-600 text-lg mr-3`}
                      ></i>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                      <i className="ri-external-link-line text-gray-400 text-sm ml-3"></i>
                    </a>
                  ))}
              </div>
            </section>
          )}

          {/* 닫기 버튼 */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
