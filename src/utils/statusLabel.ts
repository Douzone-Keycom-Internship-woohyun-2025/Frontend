import type { PatentStatus } from "../types/patent";

export const statusLabel: Record<PatentStatus, string> = {
  A: "공개",
  C: "취하",
  F: "소멸",
  G: "포기",
  I: "무효",
  J: "거절",
  R: "등록",
  "": "정보 없음",
};
