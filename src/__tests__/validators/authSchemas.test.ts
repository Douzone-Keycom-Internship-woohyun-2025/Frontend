import { loginSchema, signupSchema } from "@/validators/authSchemas";

describe("loginSchema", () => {
  it("유효한 이메일과 비밀번호를 통과시킨다", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "pass1234" });
    expect(result.success).toBe(true);
  });

  it("이메일이 없으면 실패한다", () => {
    const result = loginSchema.safeParse({ email: "", password: "pass1234" });
    expect(result.success).toBe(false);
  });

  it("이메일 형식이 잘못되면 실패한다", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "pass1234" });
    expect(result.success).toBe(false);
  });

  it("비밀번호가 없으면 실패한다", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  const valid = {
    email: "user@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("유효한 데이터를 통과시킨다", () => {
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("비밀번호가 8자 미만이면 실패한다", () => {
    const result = signupSchema.safeParse({ ...valid, password: "short", confirmPassword: "short" });
    expect(result.success).toBe(false);
  });

  it("비밀번호와 확인 비밀번호가 다르면 실패한다", () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: "different" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("confirmPassword");
    }
  });

  it("이메일 형식이 잘못되면 실패한다", () => {
    const result = signupSchema.safeParse({ ...valid, email: "invalid" });
    expect(result.success).toBe(false);
  });

  it("confirmPassword가 없으면 실패한다", () => {
    const { confirmPassword: _, ...rest } = valid;
    const result = signupSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
