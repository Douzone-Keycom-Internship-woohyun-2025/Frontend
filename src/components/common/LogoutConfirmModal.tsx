import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="w-80 bg-white rounded-xl shadow-xl p-6 animate-in fade-in-0 zoom-in-95">
        <h2 className="text-lg font-semibold text-gray-900">
          로그아웃 하시겠습니까?
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          로그아웃하면 다시 로그인해야 서비스를 이용하실 수 있습니다.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
