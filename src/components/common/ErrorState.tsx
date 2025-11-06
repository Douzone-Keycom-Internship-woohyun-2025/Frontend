interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "오류가 발생했습니다.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 min-h-[60vh]">
      <div className="bg-white shadow-md p-8 rounded-lg text-center">
        <i className="ri-error-warning-line text-5xl text-red-500 mb-3"></i>
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          문제가 발생했습니다
        </h3>
        <p className="text-gray-700 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
