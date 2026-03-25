import type { SearchPreset } from "@/types/preset";
import { toInputDateFormat } from "@/utils/dateTransform";
import { Button } from "@/components/ui/button";
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

function formatDisplayDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = toInputDateFormat(dateStr);
  return d.replace(/-/g, ".");
}

export default function PresetCard({
  preset,
  onEdit,
  onDelete,
  onUse,
}: PresetCardProps) {
  const startDisplay = formatDisplayDate(preset.startDate);
  const endDisplay = formatDisplayDate(preset.endDate);
  const hasDates = startDisplay || endDisplay;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-brand-200 transition-all overflow-hidden">
      {/* Top accent stripe */}
      <div className="h-1 bg-brand-600" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {preset.name}
            </h3>
            {preset.description && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                {preset.description}
              </p>
            )}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(preset)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="편집"
            >
              <i className="ri-edit-line text-sm" />
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="삭제"
                >
                  <i className="ri-delete-bin-line text-sm" />
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

        {/* Info section */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <i className="ri-building-line text-gray-400 text-sm" />
            <span>{preset.applicant}</span>
          </div>

          {hasDates && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <i className="ri-calendar-line text-gray-400 text-sm" />
              <span>
                {startDisplay}
                {startDisplay && endDisplay && " ~ "}
                {endDisplay}
              </span>
            </div>
          )}
        </div>

        {/* Analyze button */}
        <Button
          className="w-full"
          onClick={() =>
            onUse({
              ...preset,
              startDate: toInputDateFormat(preset.startDate),
              endDate: toInputDateFormat(preset.endDate),
            })
          }
        >
          <i className="ri-search-line" />
          분석하기
        </Button>

        {/* Created date */}
        <p className="text-xs text-gray-400 text-center mt-3">
          {new Date(preset.createdAt).toLocaleDateString("ko-KR")} 생성
        </p>
      </div>
    </div>
  );
}
