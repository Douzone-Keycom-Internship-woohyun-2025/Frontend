import type { SearchPreset } from "../../types/preset";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {editingPreset ? "프리셋 편집" : "새 프리셋 만들기"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="프리셋명"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            value={formData.applicant}
            onChange={(e) =>
              setFormData((p) => ({ ...p, applicant: e.target.value }))
            }
            placeholder="회사명"
            className="w-full border rounded-lg px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, startDate: e.target.value }))
              }
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, endDate: e.target.value }))
              }
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="설명 (선택사항)"
            className="w-full border rounded-lg px-3 py-2 resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingPreset ? "수정" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
