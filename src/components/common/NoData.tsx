import { BarChart3 } from "lucide-react";

interface NoDataProps {
  message?: string;
  subMessage?: string;
  iconSize?: number;
}

export default function NoData({
  message = "데이터가 없습니다.",
  subMessage,
  iconSize = 40,
}: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <BarChart3
        className="text-gray-400 mb-3"
        size={iconSize}
        strokeWidth={1.8}
      />
      <p className="text-base font-medium">{message}</p>
      {subMessage && <p className="text-sm text-gray-400 mt-1">{subMessage}</p>}
    </div>
  );
}
