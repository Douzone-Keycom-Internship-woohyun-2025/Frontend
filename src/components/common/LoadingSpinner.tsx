import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullscreen?: boolean; // 선택: 전체 화면 로딩 모드
}

export default function LoadingSpinner({
  message = "로딩 중입니다...",
  size = "md",
  fullscreen = false,
}: LoadingSpinnerProps) {
  const sizeClass =
    size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-8 h-8";

  const containerClass = fullscreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-gray-50/80 z-50 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-10";

  return (
    <div className={containerClass}>
      {/* 아이콘 */}
      <Loader2
        className={`animate-spin text-blue-600 ${sizeClass} mb-4`}
        strokeWidth={2.5}
      />

      {/* 메시지 */}
      <p
        className={`text-gray-600 ${
          size === "sm" ? "text-xs" : "text-sm"
        } font-medium`}
      >
        {message}
      </p>
    </div>
  );
}
