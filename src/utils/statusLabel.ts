import type { PatentStatus } from "../types/patent";

export const statusLabel: Record<PatentStatus, string> = {
  pending: "출원",
  examining: "심사중",
  published: "공개",
  registered: "등록",
  rejected: "거절",
  abandoned: "포기",
  expired: "소멸",
};
