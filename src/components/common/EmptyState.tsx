import { Search, FolderOpen, HeartOff, FileText } from "lucide-react";

type IconType = "search" | "folder" | "favorite" | "report";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: IconType;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap = {
  search: Search,
  folder: FolderOpen,
  favorite: HeartOff,
  report: FileText,
};

export default function EmptyState({
  title = "결과가 없습니다",
  description = "조건을 변경하거나 새로운 검색을 시도해보세요.",
  icon = "search",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-[50vh]">
      <div className="bg-white border rounded-xl shadow-sm p-10 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-6">{description}</p>}

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
