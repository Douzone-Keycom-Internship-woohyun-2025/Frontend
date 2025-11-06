import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "문제가 발생했습니다",
  message = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 min-h-[60vh]">
      <div className="bg-white border rounded-xl shadow-sm p-10 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
