import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FavoritesPage from "@/pages/FavoritesPage";
import { useFavorites } from "@/hooks/useFavorites";
import type { FavoriteItem, FavoriteAnalysis } from "@/types/favorite";

// ProtectedLayout → children만 렌더링
vi.mock("@/layouts/ProtectedLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// PatentList → 간단한 stub (내부 의존성 차단)
vi.mock("@/components/patent/PatentList", () => ({
  default: () => <div data-testid="patent-list" />,
}));

vi.mock("@/hooks/useFavorites");

const defaultHookValue = {
  favorites: new Set<string>(),
  favoriteItems: [] as FavoriteItem[],
  toggleFavorite: vi.fn(),
  updateMemo: vi.fn(),
  loading: false,
  error: null,
  refetch: vi.fn(),
  analysis: null as FavoriteAnalysis | null,
  analysisLoading: false,
  refetchAnalysis: vi.fn(),
};

function mockHook(overrides: Partial<typeof defaultHookValue> = {}) {
  vi.mocked(useFavorites).mockReturnValue({ ...defaultHookValue, ...overrides });
}

function renderPage() {
  return render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FavoritesPage — 로딩 상태", () => {
  it("loading=true이면 특허 목록 대신 스켈레톤을 표시한다", () => {
    mockHook({ loading: true });
    renderPage();
    // PatentList는 렌더링되지 않음
    expect(screen.queryByTestId("patent-list")).not.toBeInTheDocument();
  });
});

describe("FavoritesPage — 에러 상태", () => {
  it("error가 있으면 에러 메시지를 표시한다", () => {
    mockHook({ error: "관심 특허 목록을 불러오는 중 오류가 발생했습니다." });
    renderPage();
    expect(screen.getByText("관심 특허 목록을 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();
  });
});

describe("FavoritesPage — 빈 상태", () => {
  it("favoriteItems가 없으면 빈 상태 메시지를 표시한다", () => {
    mockHook({ favoriteItems: [] });
    renderPage();
    expect(screen.getByText("저장된 관심특허가 없습니다")).toBeInTheDocument();
  });

  it("빈 상태에서 특허 검색 링크가 /patent-search로 연결된다", () => {
    mockHook({ favoriteItems: [] });
    renderPage();
    const link = screen.getByRole("link", { name: /특허 검색하기/ });
    expect(link).toHaveAttribute("href", "/patent-search");
  });
});

describe("FavoritesPage — 데이터 있을 때", () => {
  const mockItems: FavoriteItem[] = [
    {
      id: 1,
      applicationNumber: "10-2020-0001234",
      inventionTitle: "반도체 제조 방법",
      applicantName: "삼성전자",
      abstract: null,
      applicationDate: "20200115",
      openNumber: null,
      publicationNumber: null,
      publicationDate: null,
      registerNumber: null,
      registerDate: null,
      registerStatus: "등록",
      drawingUrl: null,
      mainIpcCode: "H01L",
      memo: "중요 특허",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      applicationNumber: "10-2021-0005678",
      inventionTitle: "배터리 충전 시스템",
      applicantName: "LG에너지솔루션",
      abstract: null,
      applicationDate: "20210310",
      openNumber: null,
      publicationNumber: null,
      publicationDate: null,
      registerNumber: null,
      registerDate: null,
      registerStatus: "소멸",
      drawingUrl: null,
      mainIpcCode: "H02J",
      memo: null,
      createdAt: "2024-01-02T00:00:00Z",
    },
  ];

  it("PatentList 컴포넌트가 렌더링된다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(mockItems.map((i) => i.applicationNumber)) });
    renderPage();
    expect(screen.getByTestId("patent-list")).toBeInTheDocument();
  });

  it("stat strip에 총 건수를 표시한다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(mockItems.map((i) => i.applicationNumber)) });
    renderPage();
    expect(screen.getByText(/총 2건/)).toBeInTheDocument();
  });

  it("stat strip에 등록 건수를 표시한다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(mockItems.map((i) => i.applicationNumber)) });
    renderPage();
    // <header> 배너 내에서 "등록" 텍스트를 포함하는 span 확인
    const header = screen.getByRole("banner");
    expect(within(header).getByText(/등록/)).toHaveTextContent("1");
  });

  it("메모가 있는 특허가 있으면 메모 건수를 표시한다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(mockItems.map((i) => i.applicationNumber)) });
    renderPage();
    expect(screen.getByText(/메모/)).toBeInTheDocument();
  });
});

describe("FavoritesPage — 분석 스트립", () => {
  const mockAnalysis: FavoriteAnalysis = {
    totalCount: 10,
    statusCounts: [
      { status: "등록", count: 7 },
      { status: "소멸", count: 3 },
    ],
    ipcCounts: [{ ipc_code: "H01L", count: 5 }],
    monthlyCounts: [],
  };

  const mockItems: FavoriteItem[] = [
    {
      id: 1,
      applicationNumber: "10-2020-0001234",
      inventionTitle: "테스트",
      applicantName: "테스트",
      abstract: null,
      applicationDate: "20200101",
      openNumber: null, publicationNumber: null, publicationDate: null,
      registerNumber: null, registerDate: null,
      registerStatus: "등록",
      drawingUrl: null,
      mainIpcCode: "H01L",
      memo: null,
      createdAt: "2024-01-01T00:00:00Z",
    },
  ];

  it("analysis 데이터가 있으면 분석 스트립을 표시한다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(["10-2020-0001234"]), analysis: mockAnalysis, analysisLoading: false });
    renderPage();
    expect(screen.getByText("10건")).toBeInTheDocument();
  });

  it("분석 스트립에 최다 기술분야 IPC 코드를 표시한다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(["10-2020-0001234"]), analysis: mockAnalysis, analysisLoading: false });
    renderPage();
    expect(screen.getByText("H01L")).toBeInTheDocument();
  });

  it("analysis가 null이면 분석 스트립을 표시하지 않는다", () => {
    mockHook({ favoriteItems: mockItems, favorites: new Set(["10-2020-0001234"]), analysis: null });
    renderPage();
    expect(screen.queryByText(/최다 기술분야/)).not.toBeInTheDocument();
  });
});
