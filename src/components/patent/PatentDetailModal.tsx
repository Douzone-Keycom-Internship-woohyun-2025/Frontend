import type { PatentDetail } from "@/types/patent";
import type { AddFavoritePayload } from "@/types/favorite";
import { buildFavoritePayloadFromDetail } from "@/utils/favoritePayload";
import { getStatusColor } from "@/utils/statusColor";
import { toInputDateFormat } from "@/utils/dateTransform";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface PatentDetailModalProps {
  patent: PatentDetail | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  isFavorite: boolean;
  onToggleFavorite: (
    applicationNumber: string,
    payload?: AddFavoritePayload
  ) => void;
}

export default function PatentDetailModal({
  patent,
  isOpen,
  onClose,
  loading,
  isFavorite,
  onToggleFavorite,
}: PatentDetailModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const ipcList =
    patent?.ipcNumber?.split("|").map((ipc) => ipc.trim()) ?? [];

  const timelineItems = patent
    ? [
        {
          label: "출원일",
          date: patent.applicationDate,
          sub: patent.applicationNumber,
          icon: "ri-calendar-line",
        },
        {
          label: "공개일",
          date: patent.openDate,
          sub: patent.openNumber || "-",
          icon: "ri-eye-line",
        },
        {
          label: "등록일",
          date: patent.registerDate,
          sub: patent.registerNumber || "-",
          icon: "ri-checkbox-circle-line",
        },
      ]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {loading || !patent ? (
          <div className="p-20 flex justify-center">
            <LoadingSpinner message="상세 정보를 불러오는 중..." size="lg" />
          </div>
        ) : (
          <>
            {/* ── 헤더 ── */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-gray-200 bg-white rounded-t-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <i className="ri-file-text-line text-lg text-brand-600" />
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  특허 상세
                </h2>
                {patent.registerStatus && (
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      patent.registerStatus
                    )}`}
                  >
                    {patent.registerStatus}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const payload = buildFavoritePayloadFromDetail(patent);
                    onToggleFavorite(patent.applicationNumber, payload);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="즐겨찾기"
                >
                  {isFavorite ? (
                    <i className="ri-heart-fill text-red-500 text-lg" />
                  ) : (
                    <i className="ri-heart-line text-gray-400 text-lg" />
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="닫기"
                >
                  <i className="ri-close-line text-lg" />
                </button>
              </div>
            </div>

            {/* ── 콘텐츠 ── */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* 발명 제목 + 출원번호 */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                  {patent.inventionTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <i className="ri-hashtag" />
                    <span className="font-mono">{patent.applicationNumber}</span>
                  </span>
                  {patent.applicationDate && (
                    <span className="flex items-center gap-1.5">
                      <i className="ri-calendar-line" />
                      {toInputDateFormat(patent.applicationDate)}
                    </span>
                  )}
                </div>
              </section>

              {/* 2-column grid */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* ── 좌측: 기본 정보 ── */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    기본 정보
                  </h4>

                  {/* 출원인 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5">
                      <i className="ri-building-line" />
                      출원인
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {patent.applicantName || "정보 없음"}
                    </p>
                  </div>

                  {/* 주요 IPC */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5">
                      <i className="ri-code-line" />
                      주요 IPC
                    </label>
                    <p className="text-sm font-mono font-bold text-gray-900">
                      {patent.mainIpcCode || "정보 없음"}
                    </p>
                    {patent.ipcKorName && (
                      <p className="text-xs text-gray-500 mt-1">
                        {patent.ipcKorName}
                      </p>
                    )}
                  </div>

                  {/* 전체 IPC 목록 */}
                  {ipcList.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                        <i className="ri-list-check" />
                        전체 IPC 목록
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ipcList.map((ipc, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-md font-mono"
                          >
                            {ipc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── 우측: 날짜 타임라인 ── */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    일정 정보
                  </h4>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="relative space-y-4">
                      {timelineItems.map((item, idx) => {
                        const isLast = idx === timelineItems.length - 1;
                        return (
                          <div key={idx} className="flex gap-3 relative">
                            {/* 타임라인 세로선 */}
                            {!isLast && (
                              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200" />
                            )}
                            {/* 아이콘 */}
                            <div className="shrink-0 w-[22px] h-[22px] rounded-full bg-white border-2 border-gray-300 flex items-center justify-center z-[1]">
                              <i
                                className={`${item.icon} text-[10px] text-gray-500`}
                              />
                            </div>
                            {/* 내용 */}
                            <div className="flex-1 min-w-0 pb-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-gray-600">
                                  {item.label}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {item.date
                                    ? toInputDateFormat(item.date)
                                    : "-"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                                {item.sub}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* 요약 */}
              {patent.astrtCont && (
                <section>
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    <i className="ri-file-text-line" />
                    발명의 요약
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-brand-200">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {patent.astrtCont}
                    </p>
                  </div>
                </section>
              )}

              {/* 도면 */}
              {patent.bigDrawing && (
                <section>
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    <i className="ri-image-line" />
                    도면
                  </h4>
                  <a
                    href={patent.bigDrawing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors group"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center">
                      <i className="ri-image-line text-brand-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700 transition-colors">
                        특허 도면 원문 보기
                      </p>
                      <p className="text-xs text-gray-400">
                        새 탭에서 열립니다
                      </p>
                    </div>
                    <i className="ri-external-link-line text-gray-300 group-hover:text-brand-400 transition-colors" />
                  </a>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
