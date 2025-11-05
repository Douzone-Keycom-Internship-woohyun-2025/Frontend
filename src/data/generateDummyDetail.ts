import type { PatentDetail, PatentStatus } from "../types/patent";

const ipcByCode: Record<string, string[]> = {
  G06F: ["G06F 3/06", "G06F 11/10", "G06F 9/451"],
  H04L: ["H04L 12/58", "H04L 1/16", "H04L 27/10"],
  H04W: ["H04W 4/33", "H04W 88/08", "H04W 76/14"],
  H01L: ["H01L 21/306", "H01L 29/02", "H01L 31/10"],
  A61B: ["A61B 5/00", "A61B 5/024", "A61B 34/10"],
  B60W: ["B60W 30/095", "B60W 50/14", "B60W 60/00"],
  G06T: ["G06T 7/00", "G06T 19/00", "G06T 3/00"],
  G06N: ["G06N 3/063", "G06N 20/00", "G06N 5/04"],
  F16H: ["F16H 57/00", "F16H 1/28", "F16H 37/08"],
  H04B: ["H04B 10/00", "H04B 7/00", "H04B 1/00"],
};

const ipcFieldMap: Record<string, string> = {
  G06F: "컴퓨터",
  H04L: "통신",
  H04W: "무선통신",
  H01L: "반도체",
  A61B: "의료",
  B60W: "자동차",
  G06T: "이미지처리",
  G06N: "인공지능",
  F16H: "기계",
  H04B: "음향",
};

const formatDateToYYYYMMDD = (dateStr: string): string => {
  return dateStr.replace(/-/g, "");
};

export function generateDummyDetail(
  appNo: number,
  title: string,
  applicant: string,
  ipcCode: string,
  status: PatentStatus,
  filingDate: string
): PatentDetail {
  const ipcAll = ipcByCode[ipcCode] || [ipcCode + " 1/00"];
  const ipcMainField = ipcFieldMap[ipcCode] || "기타";
  const ipcAllFields = ipcAll.map((ipc) => {
    const mainCode = ipc.split(" ")[0];
    return ipcFieldMap[mainCode] || "기타";
  });

  const isPublished = status === "published" || status === "registered";
  const isRegistered = status === "registered";

  const filingDateYYYYMMDD = formatDateToYYYYMMDD(filingDate);
  const publicationDate = new Date(
    parseInt(filingDate.substring(0, 4)),
    parseInt(filingDate.substring(5, 7)) - 1,
    parseInt(filingDate.substring(8, 10)) + 30
  );
  const publicationDateStr = publicationDate
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  const registrationDate = new Date(
    parseInt(filingDate.substring(0, 4)),
    parseInt(filingDate.substring(5, 7)) - 1,
    parseInt(filingDate.substring(8, 10)) + 120
  );
  const registrationDateStr = registrationDate
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  const dummyBigDrawingUrl = `https://plus.kipris.or.kr/kipris/patPdfDownload.do?docDB=AP&ln=KO&cc=KR&bn=${appNo}`;
  const dummyDrawingUrl = `https://plus.kipris.or.kr/kipris/patImgIPDSearch.do?method=imgListSearch&applNo=${appNo}`;

  return {
    applicationNumber: appNo,
    title,
    applicant,
    filingDate: filingDateYYYYMMDD, // ← 리스트 출원일 사용
    openDate: isPublished ? publicationDateStr : undefined,
    openNumber: isPublished ? appNo + 5000 : undefined,
    publicationDate: null,
    publicationNumber: null,
    registerDate: isRegistered ? registrationDateStr : null,
    registerNumber: isRegistered ? appNo + 8000 : null,
    ipcMain: ipcAll[0],
    ipcMainField,
    ipcAll,
    ipcAllFields,
    status,
    abstract: `${title}에 관한 발명으로, 시스템의 성능과 신뢰성을 향상시키는 방법을 제안한다. 특히 ${ipcMainField} 기술 분야에서 혁신적인 기여를 한다.`,
    bigDrawing: dummyBigDrawingUrl,
    drawing: dummyDrawingUrl,
  };
}
