import type { SearchPreset } from "../../types/preset";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
  const toInputDate = (str: string) =>
    str && str.length === 8
      ? `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`
      : str;

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-gray-400 hover:text-red-600" title="삭제">
                <i className="ri-delete-bin-line"></i>
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  삭제된 프리셋은 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => onDelete(preset.id)}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <div>
          <strong>회사:</strong> {preset.applicant}
        </div>
        {preset.startDate && (
          <div>
            <strong>시작일:</strong> {toInputDate(preset.startDate)}
          </div>
        )}
        {preset.endDate && (
          <div>
            <strong>종료일:</strong> {toInputDate(preset.endDate)}
          </div>
        )}
        <div className="text-gray-500 text-xs">
          생성일: {new Date(preset.createdAt).toLocaleDateString()}
        </div>
      </div>

      <button
        onClick={() =>
          onUse({
            ...preset,
            startDate: toInputDate(preset.startDate),
            endDate: toInputDate(preset.endDate),
          })
        }
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <i className="ri-search-line mr-2"></i>이 프리셋으로 분석하기
      </button>
    </div>
  );
}
