import type { PatentDetail, PatentStatus } from "../types/patent";
const ipcByCode: Record<string, string[]> = {
  G06F: ["G06F 3/06", "G06F 11/10", "G06F 9/451"],
  H04L: ["H04L 12/58", "H04L 1/16", "H04L 27/10"],
};
export function generateDummyDetail(
  appNo: number,
  title: string,
  applicant: string,
  ipcCode: string,
  status: PatentStatus
): PatentDetail {
  const ipcAll = ipcByCode[ipcCode] || [ipcCode + " 1/00"];
  return {
    applicationNumber: appNo,
    title,
    applicant,
    filingDate: "2025-10-10",
    openDate:
      status === "published" || status === "registered"
        ? "2025-10-21"
        : undefined,
    openNumber:
      status === "published" || status === "registered"
        ? appNo + 5000
        : undefined,
    publicationDate: null,
    publicationNumber: null,
    registerDate: status === "registered" ? "2025-11-15" : null,
    registerNumber: status === "registered" ? appNo + 8000 : null,
    ipcMain: ipcAll[0],
    ipcAll,
    status,
    abstract: `${title}에 관한 발명으로, 시스템의 성능과 신뢰성을 향상시키는 방법을 제안한다.`,
    bigDrawing: null,
    drawing: null,
  };
}
