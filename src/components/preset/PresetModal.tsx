import { useEffect } from "react";
import type { SearchPreset } from "@/types/preset";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    name: string;
    applicant: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      applicant: string;
      startDate: string;
      endDate: string;
      description: string;
    }>
  >;
  editingPreset: SearchPreset | null;
}

export default function PresetModal({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  editingPreset,
}: PresetModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600">
              <i className={editingPreset ? "ri-edit-line text-sm" : "ri-add-line text-sm"} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              {editingPreset ? "프리셋 편집" : "새 프리셋 만들기"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Preset name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              프리셋명
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="프리셋 이름을 입력하세요"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              회사명
            </label>
            <Input
              type="text"
              value={formData.applicant}
              onChange={(e) =>
                setFormData((p) => ({ ...p, applicant: e.target.value }))
              }
              placeholder="회사명을 입력하세요"
            />
          </div>

          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              기간
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-xs text-gray-500 mb-1">시작일</span>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">종료일</span>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              설명
              <span className="text-xs text-gray-400 font-normal ml-1">선택사항</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="프리셋에 대한 간단한 설명을 입력하세요"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-6 py-4 border-t border-gray-100">
          <Button onClick={onSave} className="w-full">
            <i className={editingPreset ? "ri-check-line" : "ri-save-line"} />
            {editingPreset ? "수정" : "저장"}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
