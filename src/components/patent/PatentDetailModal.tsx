import { useState, useEffect } from "react";
import type { PatentDetail } from "@/types/patent";
import type { AddFavoritePayload } from "@/types/favorite";
import { buildFavoritePayloadFromDetail } from "@/utils/favoritePayload";
import { getStatusColor } from "@/utils/statusColor";
import { toInputDateFormat } from "@/utils/dateTransform";
import { SkeletonPatentDetail } from "@/components/common/Skeleton";

interface PatentDetailModalProps {
  patent: PatentDetail | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
  isFavorite: boolean;
  onToggleFavorite: (
    applicationNumber: string,
    payload?: AddFavoritePayload
  ) => void;
  memo?: string | null;
  onMemoSave?: (memo: string | null) => void;
}

export default function PatentDetailModal({
  patent,
  isOpen,
  onClose,
  loading,
  error,
  onRetry,
  isFavorite,
  onToggleFavorite,
  memo,
  onMemoSave,
}: PatentDetailModalProps) {
  const [editMemo, setEditMemo] = useState(memo ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync memo when patent changes
  useEffect(() => {
    setEditMemo(memo ?? "");
    setIsEditing(false);
  }, [memo, patent?.applicationNumber]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleMemoSave = async () => {
    if (!onMemoSave) return;
    setIsSaving(true);
    try {
      await onMemoSave(editMemo.trim() || null);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const ipcList =
    patent?.ipcNumber?.split("|").map((ipc) => ipc.trim()) ?? [];

  const dateItems = patent
    ? [
        { label: "출원", date: patent.applicationDate, num: patent.applicationNumber, icon: "ri-edit-line", color: "text-brand-600 bg-brand-50 border-brand-200" },
        { label: "공개", date: patent.openDate, num: patent.openNumber, icon: "ri-eye-line", color: "text-blue-600 bg-blue-50 border-blue-200" },
        { label: "등록", date: patent.registerDate, num: patent.registerNumber, icon: "ri-checkbox-circle-line", color: "text-green-600 bg-green-50 border-green-200" },
      ]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end sm:flex-row sm:items-center sm:justify-center bg-black/40 backdrop-blur-sm sm:p-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[90vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <i className="ri-error-warning-line text-xl text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">상세 정보를 불러오지 못했습니다</p>
              <p className="text-xs text-gray-500 mt-1">잠시 후 다시 시도해주세요.</p>
            </div>
            <div className="flex gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-lg hover:bg-brand-800 transition-colors"
                >
                  <i className="ri-refresh-line mr-1.5" />
                  다시 시도
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        ) : loading || !patent ? (
          <SkeletonPatentDetail />
        ) : (
          <>
            {/* 모바일 드래그 핸들 */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* ── 헤더 ── */}
            <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    {patent.registerStatus && (
                      <span
                        className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusColor(
                          patent.registerStatus
                        )}`}
                      >
                        {patent.registerStatus}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 font-mono truncate">
                      {patent.applicationNumber}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 leading-snug line-clamp-2">
                    {patent.inventionTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <i className="ri-building-line text-gray-400" />
                      {patent.applicantName || "정보 없음"}
                    </span>
                    {patent.applicationDate && (
                      <span className="flex items-center gap-1.5">
                        <i className="ri-calendar-line text-gray-400" />
                        {toInputDateFormat(patent.applicationDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      const payload = buildFavoritePayloadFromDetail(patent);
                      onToggleFavorite(patent.applicationNumber, payload);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    aria-label="즐겨찾기"
                  >
                    <i className={`${isFavorite ? "ri-heart-fill" : "ri-heart-line"} text-lg`} />
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
            </div>

            {/* ── 콘텐츠 ── */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* 날짜 카드 3개 가로 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {dateItems.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-lg border p-2.5 sm:p-3 ${item.date ? item.color : "bg-gray-50 border-gray-200 text-gray-400"}`}
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                      <i className={`${item.icon} text-xs sm:text-sm`} />
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold ${item.date ? "text-gray-900" : "text-gray-400"}`}>
                      {item.date ? toInputDateFormat(item.date) : "-"}
                    </p>
                    {item.num && (
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                        {item.num}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* IPC 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="ri-code-line" />
                    IPC 분류
                  </h4>
                  {patent.mainIpcCode && (
                    <span className="text-xs font-mono font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded">
                      {patent.mainIpcCode}
                    </span>
                  )}
                </div>
                {patent.ipcKorName && (
                  <p className="text-sm text-gray-700 mb-2">
                    {patent.ipcKorName}
                  </p>
                )}
                {ipcList.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200">
                    {ipcList.map((ipc, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          ipc === patent.mainIpcCode
                            ? "bg-brand-100 text-brand-700 font-semibold"
                            : "bg-white text-gray-600 border border-gray-200"
                        }`}
                      >
                        {ipc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 요약 */}
              {patent.astrtCont && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <i className="ri-file-text-line" />
                    발명의 요약
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-[3px] border-brand-300">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {patent.astrtCont}
                    </p>
                  </div>
                </div>
              )}

              {/* 메모 — 관심특허에 저장된 경우에만 표시 */}
              {isFavorite && onMemoSave && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="ri-sticky-note-line text-amber-400" />
                      메모
                    </h4>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-brand-700 hover:text-brand-800 font-medium flex items-center gap-1"
                      >
                        <i className="ri-edit-line" />
                        {editMemo ? "편집" : "메모 추가"}
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editMemo}
                        onChange={(e) => setEditMemo(e.target.value)}
                        placeholder="이 특허에 대한 메모를 입력하세요..."
                        rows={4}
                        className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent placeholder:text-gray-400"
                        autoFocus
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditMemo(memo ?? "");
                            setIsEditing(false);
                          }}
                          className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleMemoSave}
                          disabled={isSaving}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {isSaving && <i className="ri-loader-4-line animate-spin" />}
                          저장
                        </button>
                      </div>
                    </div>
                  ) : editMemo ? (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {editMemo}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all"
                    >
                      <i className="ri-add-line" />
                      메모 추가
                    </button>
                  )}
                </div>
              )}

              {/* 도면 */}
              {patent.bigDrawing && (
                <a
                  href={patent.bigDrawing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-3.5 border border-gray-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <i className="ri-image-line text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700 transition-colors">
                      특허 도면 원문 보기
                    </p>
                    <p className="text-[11px] text-gray-400">새 탭에서 열립니다</p>
                  </div>
                  <i className="ri-arrow-right-up-line text-gray-300 group-hover:text-brand-500 transition-colors" />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
