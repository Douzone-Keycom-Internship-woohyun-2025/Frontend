import { useAuthStore } from "@/store/authStore";

// localStorage는 jsdom 환경에서 사용 가능
beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ isLoggedIn: false, userEmail: "" });
});

// 테스트용 JWT 생성 (exp: 현재 + 1시간)
function makeJwt(expOffset: number = 3600): string {
  const payload = { exp: Math.floor(Date.now() / 1000) + expOffset };
  const encoded = btoa(JSON.stringify(payload));
  return `header.${encoded}.signature`;
}

describe("useAuthStore - login", () => {
  it("login 호출 시 isLoggedIn이 true가 된다", () => {
    useAuthStore.getState().login(makeJwt(), "user@example.com");
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });

  it("login 호출 시 userEmail이 저장된다", () => {
    useAuthStore.getState().login(makeJwt(), "user@example.com");
    expect(useAuthStore.getState().userEmail).toBe("user@example.com");
  });

  it("login 호출 시 localStorage에 accessToken이 저장된다", () => {
    const token = makeJwt();
    useAuthStore.getState().login(token, "user@example.com");
    expect(localStorage.getItem("accessToken")).toBe(token);
  });

  it("login 호출 시 localStorage에 userEmail이 저장된다", () => {
    useAuthStore.getState().login(makeJwt(), "user@example.com");
    expect(localStorage.getItem("userEmail")).toBe("user@example.com");
  });
});

describe("useAuthStore - logout", () => {
  beforeEach(() => {
    useAuthStore.getState().login(makeJwt(), "user@example.com");
    localStorage.setItem("refreshToken", "some-refresh-token");
  });

  it("logout 호출 시 isLoggedIn이 false가 된다", () => {
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });

  it("logout 호출 시 userEmail이 초기화된다", () => {
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().userEmail).toBe("");
  });

  it("logout 호출 시 localStorage에서 accessToken이 제거된다", () => {
    useAuthStore.getState().logout();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("logout 호출 시 localStorage에서 refreshToken이 제거된다", () => {
    useAuthStore.getState().logout();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });

  it("logout 호출 시 localStorage에서 userEmail이 제거된다", () => {
    useAuthStore.getState().logout();
    expect(localStorage.getItem("userEmail")).toBeNull();
  });
});
