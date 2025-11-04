import type { PatentListResponse, PatentStatus } from "../types/patent";

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
const ipcCodes = [
  "G06F",
  "H04L",
  "H04W",
  "H01L",
  "A61B",
  "B60W",
  "G06T",
  "G06N",
  "F16H",
  "H04B",
];
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
const statuses: PatentStatus[] = [
  "published",
  "registered",
  "examining",
  "pending",
  "rejected",
  "expired",
];

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T>(arr: T[]) => arr[rand(arr.length)];
const pad2 = (n: number) => String(n).padStart(2, "0");
const randomDate = (year: number) =>
  `${year}-${pad2(1 + rand(12))}-${pad2(1 + rand(28))}`;

export function generateDummyPatentListResponse(
  count = 200
): PatentListResponse {
  const base = 1020250100000;
  const patents = Array.from({ length: count }).map((_, i) => {
    const appNo = base + i + 1;
    const company = pick(companies);
    const ipc = pick(ipcCodes);
    const title = pick(titles);
    const status = pick(statuses);
    const year = 2024 + rand(2);
    return {
      applicationNumber: appNo,
      title: `${title} ${i + 1}`,
      applicant: company,
      filingDate: randomDate(year),
      ipcCode: ipc,
      status,
      isFavorite: Math.random() < 0.2,
    };
  });
  return {
    total: count,
    page: 1,
    totalPages: Math.max(1, Math.ceil(count / 20)),
    patents,
  };
}
