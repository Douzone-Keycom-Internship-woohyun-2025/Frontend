import type { PatentStatus } from "../types/patent";
import { statusLabel } from "./statusLabel";

export const getStatusColor = (status: PatentStatus | string): string => {
  const koreanStatus = statusLabel[status as PatentStatus] || status;

  switch (koreanStatus) {
    case "등록":
      return "bg-green-100 text-green-800";
    case "출원":
      return "bg-blue-100 text-blue-800";
    case "심사중":
      return "bg-yellow-100 text-yellow-800";
    case "거절":
      return "bg-red-100 text-red-800";
    case "포기":
      return "bg-gray-100 text-gray-800";
    case "공개":
      return "bg-purple-100 text-purple-800";
    case "소멸":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
