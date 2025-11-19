import type {
  PatentListResponse,
  PatentListItem,
  PatentStatus,
} from "../types/patent";

const companies = [
  "삼성전자주식회사",
  "엘지전자 주식회사",
  "현대자동차",
  "네이버",
  "카카오",
  "SK하이닉스",
  "한화시스템",
  "롯데정보통신",
];

// IPC 코드 + 분야
const ipcCodeWithField = [
  { code: "G06F", field: "컴퓨터" },
  { code: "H04L", field: "통신" },
  { code: "H04W", field: "무선통신" },
  { code: "H01L", field: "반도체" },
  { code: "A61B", field: "의료" },
  { code: "B60W", field: "자동차" },
  { code: "G06T", field: "이미지처리" },
  { code: "G06N", field: "인공지능" },
  { code: "F16H", field: "기계" },
  { code: "H04B", field: "음향" },
];

// 더미 발명명칭
const titles = [
  "개선된 SSD 신뢰성",
  "통신 시스템 방법",
  "자율주행 센서 융합",
  "반도체 공정 최적화",
  "경량 암호 알고리즘",
  "네트워크 지연 감소",
  "고효율 배터리 관리",
  "분산 트랜잭션 처리",
  "멀티모달 인식",
  "엣지 AI 최적화",
];

// 실제 PatentStatus 값에 맞춘 상태 목록
const registerStatuses: PatentStatus[] = [
  "A",
  "C",
  "F",
  "G",
  "I",
  "J",
  "R",
  "",
];

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T>(arr: T[]) => arr[rand(arr.length)];
const pad2 = (n: number) => String(n).padStart(2, "0");

const randomDate = (year: number): string =>
  `${year}-${pad2(1 + rand(12))}-${pad2(1 + rand(28))}`;

/**
 * PatentListResponse 더미 데이터를 반환
 */
export function generateDummyPatentListResponse(
  count = 200
): PatentListResponse {
  const patents: PatentListItem[] = Array.from({ length: count }).map(
    (_, i) => {
      const applicationNumber = `KR${202400000000 + i}`; // 문자열로 변경
      const company = pick(companies);
      const ipcObj = pick(ipcCodeWithField);
      const inventionTitle = pick(titles);
      const registerStatus = pick(registerStatuses);
      const year = 2023 + rand(3);

      return {
        applicationNumber,
        inventionTitle: `${inventionTitle} ${i + 1}`,
        applicantName: company,
        applicationDate: randomDate(year),
        mainIpcCode: ipcObj.code,
        ipcKorName: ipcObj.field,
        registerStatus,
        isFavorite: Math.random() < 0.2,
      };
    }
  );

  return {
    total: count,
    page: 1,
    totalPages: Math.ceil(count / 20),
    patents,
  };
}
