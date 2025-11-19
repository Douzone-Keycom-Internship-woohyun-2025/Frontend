import type { PatentDetail, PatentStatus } from "../types/patent";

// IPC 분야 맵
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

const toYYYYMMDD = (str: string) => str.replace(/-/g, "");

export function generateDummyDetail(
  applicationNumber: string,
  inventionTitle: string = "",
  applicantName: string = "",
  mainIpcCode: string = "",
  registerStatus: PatentStatus = "",
  applicationDate: string = ""
): PatentDetail {
  const ipcKorName = ipcFieldMap[mainIpcCode] || "기타";

  const filingDate = applicationDate ? toYYYYMMDD(applicationDate) : "";

  const baseDate = applicationDate ? new Date(applicationDate) : new Date();
  const openDate = toYYYYMMDD(
    new Date(baseDate.getTime() + 30 * 86400000).toISOString().split("T")[0]
  );
  const registerDate = toYYYYMMDD(
    new Date(baseDate.getTime() + 120 * 86400000).toISOString().split("T")[0]
  );

  const drawing = `https://plus.kipris.or.kr/kipris/patImgIPDSearch.do?method=imgListSearch&applNo=${applicationNumber}`;

  return {
    applicationNumber,
    inventionTitle,
    applicantName,
    applicationDate: filingDate,

    openDate: registerStatus ? openDate : undefined,
    openNumber: registerStatus ? `${applicationNumber}-OPEN` : undefined,

    publicationDate: null,
    publicationNumber: null,

    registerDate: registerStatus ? registerDate : null,
    registerNumber: registerStatus ? `${applicationNumber}-REG` : null,

    registerStatus,

    mainIpcCode,
    ipcKorName,
    ipcNumber: mainIpcCode,

    astrtCont: `${inventionTitle}에 관한 발명으로, ${ipcKorName} 분야에서 기술적 향상을 제공하는 발명입니다.`,

    drawing,

    isFavorite: false,
  };
}
