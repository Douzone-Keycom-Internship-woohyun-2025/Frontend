import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "@/components/auth/Login";
import { loginApi } from "@/api/auth";

// useNavigate만 교체, Link 등 나머지는 실제 모듈 유지
const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock("react-router-dom", async () => {
  const real = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...real, useNavigate: () => mockNavigate };
});

vi.mock("@/api/auth", () => ({
  loginApi: vi.fn(),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

const mockLoginSuccess = () =>
  vi.mocked(loginApi).mockResolvedValue({
    data: {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: { email: "user@example.com" },
    },
  } as never);

const mockLoginFail = (message = "이메일 또는 비밀번호가 올바르지 않습니다.") => {
  const err = Object.assign(new Error("Unauthorized"), {
    isAxiosError: true,
    response: { data: { message } },
  });
  vi.mocked(loginApi).mockRejectedValue(err);
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("Login — 렌더링", () => {
  it("이메일·비밀번호 입력 필드와 로그인 버튼이 있다", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호를 입력하세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("회원가입 링크가 있다", () => {
    renderLogin();
    expect(screen.getByRole("link", { name: "회원가입" })).toBeInTheDocument();
  });
});

describe("Login — 유효성 검사", () => {
  it("이메일이 비어있으면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByText("이메일을 입력하세요")).toBeInTheDocument();
  });

  it("이메일 형식이 잘못되면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    renderLogin();
    // type="email" input은 jsdom native constraint validation이 button click시 submit을 막으므로
    // fireEvent.submit으로 react-hook-form 핸들러에 직접 도달
    await user.type(screen.getByPlaceholderText("name@company.com"), "not-an-email");
    fireEvent.submit(screen.getByRole("button", { name: "로그인" }).closest("form")!);
    expect(await screen.findByText("올바른 이메일 형식이 아닙니다")).toBeInTheDocument();
  });

  it("비밀번호가 비어있으면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText("name@company.com"), "user@example.com");
    await user.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByText("비밀번호를 입력하세요")).toBeInTheDocument();
  });
});

describe("Login — API 연동", () => {
  it("로그인 성공 시 '/'로 이동한다", async () => {
    const user = userEvent.setup();
    mockLoginSuccess();
    renderLogin();

    await user.type(screen.getByPlaceholderText("name@company.com"), "user@example.com");
    await user.type(screen.getByPlaceholderText("비밀번호를 입력하세요"), "password123");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("로그인 성공 시 refreshToken을 localStorage에 저장한다", async () => {
    const user = userEvent.setup();
    mockLoginSuccess();
    renderLogin();

    await user.type(screen.getByPlaceholderText("name@company.com"), "user@example.com");
    await user.type(screen.getByPlaceholderText("비밀번호를 입력하세요"), "password123");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(localStorage.getItem("refreshToken")).toBe("mock-refresh-token");
    });
  });

  it("서버 에러 시 에러 메시지를 화면에 표시한다", async () => {
    const user = userEvent.setup();
    mockLoginFail("이메일 또는 비밀번호가 올바르지 않습니다.");
    renderLogin();

    await user.type(screen.getByPlaceholderText("name@company.com"), "user@example.com");
    await user.type(screen.getByPlaceholderText("비밀번호를 입력하세요"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(await screen.findByText("이메일 또는 비밀번호가 올바르지 않습니다.")).toBeInTheDocument();
  });

  it("제출 중에는 버튼이 '로그인 중...' 텍스트로 바뀌고 disabled 상태가 된다", async () => {
    const user = userEvent.setup();
    let settle: () => void;
    // 명시적으로 제어 가능한 Promise — 테스트 종료 전에 직접 resolve
    vi.mocked(loginApi).mockImplementation(
      () => new Promise((resolve) => { settle = resolve as () => void; })
    );
    renderLogin();

    await user.type(screen.getByPlaceholderText("name@company.com"), "user@example.com");
    await user.type(screen.getByPlaceholderText("비밀번호를 입력하세요"), "password123");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(screen.getByText("로그인 중...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그인 중/ })).toBeDisabled();

    // Promise 정리 — 미결 상태로 테스트 종료 방지
    settle!();
  });
});
