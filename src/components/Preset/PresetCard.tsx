import type { SearchPreset } from "../../types/preset";

interface PresetCardProps {
  preset: SearchPreset;
  onEdit: (preset: SearchPreset) => void;
  onDelete: (id: string) => void;
  onUse: (preset: SearchPreset) => void;
}

export default function PresetCard({
  preset,
  onEdit,
  onDelete,
  onUse,
}: PresetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md p-6 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{preset.name}</h3>
          {preset.description && (
            <p className="text-sm text-gray-600">{preset.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(preset)}
            className="text-gray-400 hover:text-gray-600"
            title="편집"
          >
            <i className="ri-edit-line"></i>
          </button>
          <button
            onClick={() => onDelete(preset.id)}
            className="text-gray-400 hover:text-red-600"
            title="삭제"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <div>
          <strong>회사:</strong> {preset.applicant}
        </div>
        {preset.startDate && (
          <div>
            <strong>시작일:</strong> {preset.startDate}
          </div>
        )}
        {preset.endDate && (
          <div>
            <strong>종료일:</strong> {preset.endDate}
          </div>
        )}
        <div className="text-gray-500 text-xs">
          생성일: {new Date(preset.createdAt).toLocaleDateString()}
        </div>
      </div>

      <button
        onClick={() => onUse(preset)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <i className="ri-search-line mr-2"></i>이 프리셋으로 분석하기
      </button>
    </div>
  );
}
