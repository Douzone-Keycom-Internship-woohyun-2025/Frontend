import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { createElement } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { server } from "@/test/server";
import {
  favoritesHandlers,
  mockFavoriteItem,
  mockAnalysis,
} from "@/test/handlers/favorites";
import type { AddFavoritePayload } from "@/types/favorite";

const BASE = "http://localhost:3000";

// 각 테스트마다 독립적인 QueryClient 생성 (캐시 공유 방지)
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  server.use(...favoritesHandlers);
  localStorage.clear();
});

describe("useFavorites — 데이터 로드", () => {
  it("초기 로딩 중에는 loading이 true다", () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });
    expect(result.current.loading).toBe(true);
  });

  it("API 응답 후 favoriteItems가 채워진다", async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.favoriteItems).toHaveLength(1);
    expect(result.current.favoriteItems[0].applicationNumber).toBe(
      mockFavoriteItem.applicationNumber
    );
  });

  it("favorites Set이 applicationNumber로 구성된다", async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.favorites).toBeInstanceOf(Set);
    expect(result.current.favorites.has(mockFavoriteItem.applicationNumber)).toBe(true);
  });

  it("API 에러 시 error 메시지를 반환한다", async () => {
    server.use(
      http.get(`${BASE}/favorites`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 })
      )
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      "관심 특허 목록을 불러오는 중 오류가 발생했습니다."
    );
  });

  it("빈 목록도 정상 처리한다", async () => {
    server.use(
      http.get(`${BASE}/favorites`, () =>
        HttpResponse.json({ data: { favorites: [], total: 0 } })
      )
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.favoriteItems).toHaveLength(0);
    expect(result.current.favorites.size).toBe(0);
    expect(result.current.error).toBeNull();
  });
});

describe("useFavorites — toggleFavorite", () => {
  it("즐겨찾기에 없는 특허를 추가하면 POST 요청이 발생한다", async () => {
    let postCalled = false;
    server.use(
      http.post(`${BASE}/favorites`, () => {
        postCalled = true;
        return HttpResponse.json({ data: mockFavoriteItem }, { status: 201 });
      })
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const payload: AddFavoritePayload = {
      applicationNumber: "10-2021-0099999",
      inventionTitle: "새 발명",
      applicantName: "LG전자",
      abstract: null,
      applicationDate: "20210101",
      openNumber: null,
      publicationNumber: null,
      publicationDate: null,
      registerNumber: null,
      registerDate: null,
      registerStatus: null,
      drawingUrl: null,
      ipcNumber: null,
      mainIpcCode: null,
    };

    await act(async () => {
      await result.current.toggleFavorite("10-2021-0099999", payload);
    });

    expect(postCalled).toBe(true);
  });

  it("이미 즐겨찾기에 있는 특허를 토글하면 DELETE 요청이 발생한다", async () => {
    let deletedNumber: string | undefined;
    server.use(
      http.delete(`${BASE}/favorites/:applicationNumber`, ({ params }) => {
        deletedNumber = params.applicationNumber as string;
        return HttpResponse.json({ data: { success: true } });
      })
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // mockFavoriteItem.applicationNumber는 이미 favorites Set에 있음
    await act(async () => {
      await result.current.toggleFavorite(mockFavoriteItem.applicationNumber);
    });

    expect(deletedNumber).toBe(mockFavoriteItem.applicationNumber);
  });

  it("payload 없이 추가 시도하면 POST 요청이 발생하지 않는다", async () => {
    let postCalled = false;
    server.use(
      http.post(`${BASE}/favorites`, () => {
        postCalled = true;
        return HttpResponse.json({ data: mockFavoriteItem });
      })
    );

    // 빈 목록으로 시작해서 "즐겨찾기 아님" 상태 만들기
    server.use(
      http.get(`${BASE}/favorites`, () =>
        HttpResponse.json({ data: { favorites: [], total: 0 } })
      )
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      // payload 없이 호출 — 추가 불가 케이스
      await result.current.toggleFavorite("10-9999-0000001");
    });

    expect(postCalled).toBe(false);
  });
});

describe("useFavorites — updateMemo", () => {
  it("updateMemo 호출 시 PATCH 요청이 올바른 번호로 발생한다", async () => {
    let patchedNumber: string | undefined;
    server.use(
      http.patch(`${BASE}/favorites/:applicationNumber`, ({ params }) => {
        patchedNumber = params.applicationNumber as string;
        return HttpResponse.json({ data: null });
      })
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateMemo(mockFavoriteItem.applicationNumber, "중요 메모");
    });

    expect(patchedNumber).toBe(mockFavoriteItem.applicationNumber);
  });
});

describe("useFavorites — analysis", () => {
  it("favoriteItems가 있을 때 분석 데이터를 로드한다", async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    // analysis 쿼리는 favoriteItems.length > 0 일 때 enabled
    await waitFor(() => expect(result.current.analysis).not.toBeNull(), {
      timeout: 3000,
    });

    expect(result.current.analysis?.totalCount).toBe(mockAnalysis.totalCount);
    expect(result.current.analysis?.ipcCounts[0].ipc_code).toBe("H01L");
  });

  it("favoriteItems가 없으면 분석 데이터를 요청하지 않는다", async () => {
    server.use(
      http.get(`${BASE}/favorites`, () =>
        HttpResponse.json({ data: { favorites: [], total: 0 } })
      )
    );

    let analysisCalled = false;
    server.use(
      http.get(`${BASE}/favorites/analysis`, () => {
        analysisCalled = true;
        return HttpResponse.json({ data: mockAnalysis });
      })
    );

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 잠시 대기 후에도 analysis API가 호출되지 않아야 함
    await new Promise((r) => setTimeout(r, 100));
    expect(analysisCalled).toBe(false);
    expect(result.current.analysis).toBeNull();
  });
});
