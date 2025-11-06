interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  message = "로딩 중입니다...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClass =
    size === "sm"
      ? "h-6 w-6 border-2"
      : size === "lg"
        ? "h-12 w-12 border-4"
        : "h-8 w-8 border-3";

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className={`animate-spin ${sizeClass} border-blue-500 border-t-transparent rounded-full mb-4`}
      ></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
