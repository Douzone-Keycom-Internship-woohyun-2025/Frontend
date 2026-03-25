import { toInputDateFormat, toApiDateFormat } from "@/utils/dateTransform";

describe("toInputDateFormat", () => {
  it("8자리 날짜를 YYYY-MM-DD 형식으로 변환한다", () => {
    expect(toInputDateFormat("20240101")).toBe("2024-01-01");
  });

  it("이미 하이픈 포함된 날짜는 그대로 반환한다", () => {
    expect(toInputDateFormat("2024-01-01")).toBe("2024-01-01");
  });

  it("빈 문자열이면 빈 문자열을 반환한다", () => {
    expect(toInputDateFormat("")).toBe("");
  });

  it("undefined이면 빈 문자열을 반환한다", () => {
    expect(toInputDateFormat(undefined)).toBe("");
  });

  it("8자 미만 문자열은 그대로 반환한다", () => {
    expect(toInputDateFormat("2024")).toBe("2024");
  });
});

describe("toApiDateFormat", () => {
  it("YYYY-MM-DD를 YYYYMMDD로 변환한다", () => {
    expect(toApiDateFormat("2024-01-01")).toBe("20240101");
  });

  it("이미 하이픈 없는 날짜는 그대로 반환한다", () => {
    expect(toApiDateFormat("20240101")).toBe("20240101");
  });

  it("빈 문자열이면 빈 문자열을 반환한다", () => {
    expect(toApiDateFormat("")).toBe("");
  });

  it("undefined이면 빈 문자열을 반환한다", () => {
    expect(toApiDateFormat(undefined)).toBe("");
  });

  it("하이픈이 여러 개여도 모두 제거한다", () => {
    expect(toApiDateFormat("2024-01-01")).toBe("20240101");
  });
});
