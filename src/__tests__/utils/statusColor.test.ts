import { getStatusColor } from "@/utils/statusColor";

describe("getStatusColor", () => {
  it("등록 상태는 green 클래스를 반환한다", () => {
    expect(getStatusColor("등록")).toBe("bg-green-100 text-green-800");
  });

  it("영문 코드 R(등록)을 올바르게 처리한다", () => {
    expect(getStatusColor("R")).toBe("bg-green-100 text-green-800");
  });

  it("공개 상태는 purple 클래스를 반환한다", () => {
    expect(getStatusColor("공개")).toBe("bg-purple-100 text-purple-800");
  });

  it("영문 코드 A(공개)를 올바르게 처리한다", () => {
    expect(getStatusColor("A")).toBe("bg-purple-100 text-purple-800");
  });

  it("취하 상태는 gray-200 클래스를 반환한다", () => {
    expect(getStatusColor("취하")).toBe("bg-gray-200 text-gray-800");
  });

  it("소멸 상태는 gray-200 클래스를 반환한다", () => {
    expect(getStatusColor("소멸")).toBe("bg-gray-200 text-gray-800");
  });

  it("영문 코드 F(소멸)를 올바르게 처리한다", () => {
    expect(getStatusColor("F")).toBe("bg-gray-200 text-gray-800");
  });

  it("거절 상태는 red 클래스를 반환한다", () => {
    expect(getStatusColor("거절")).toBe("bg-red-100 text-red-800");
  });

  it("영문 코드 J(거절)를 올바르게 처리한다", () => {
    expect(getStatusColor("J")).toBe("bg-red-100 text-red-800");
  });

  it("알 수 없는 상태는 기본 gray 클래스를 반환한다", () => {
    expect(getStatusColor("알 수 없음")).toBe("bg-gray-100 text-gray-800");
  });

  it("무효 상태는 red 클래스를 반환한다", () => {
    expect(getStatusColor("무효")).toBe("bg-red-100 text-red-800");
  });

  it("포기 상태는 gray 클래스를 반환한다", () => {
    expect(getStatusColor("포기")).toBe("bg-gray-100 text-gray-800");
  });
});
