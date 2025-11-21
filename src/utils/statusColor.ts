import type { PatentStatus } from "../types/patent";

const normalizeStatus = (status: PatentStatus | string | undefined): string => {
  if (!status) return "";

  const s = status.toString().trim();

  switch (s) {
    case "R":
      return "등록";
    case "A":
      return "공개";
    case "C":
      return "취하";
    case "F":
      return "소멸";
    case "G":
      return "포기";
    case "I":
      return "무효";
    case "J":
      return "거절";
    default:
      return s;
  }
};

export const getStatusColor = (status: PatentStatus | string): string => {
  const koreanStatus = normalizeStatus(status);

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
    case "취하":
      return "bg-gray-200 text-gray-800";
    case "무효":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
