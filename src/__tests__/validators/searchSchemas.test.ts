import { basicSearchSchema, advancedSearchSchema } from "@/validators/searchSchemas";

describe("basicSearchSchema", () => {
  const valid = {
    applicant: "삼성전자",
    startDate: "2020-01-01",
    endDate: "2024-12-31",
  };

  it("유효한 데이터를 통과시킨다", () => {
    expect(basicSearchSchema.safeParse(valid).success).toBe(true);
  });

  it("applicant가 없으면 실패한다", () => {
    expect(basicSearchSchema.safeParse({ ...valid, applicant: "" }).success).toBe(false);
  });

  it("startDate가 없으면 실패한다", () => {
    expect(basicSearchSchema.safeParse({ ...valid, startDate: "" }).success).toBe(false);
  });

  it("endDate가 없으면 실패한다", () => {
    expect(basicSearchSchema.safeParse({ ...valid, endDate: "" }).success).toBe(false);
  });

  it("startDate가 endDate보다 늦으면 실패한다", () => {
    const result = basicSearchSchema.safeParse({ ...valid, startDate: "2024-12-31", endDate: "2020-01-01" });
    expect(result.success).toBe(false);
  });

  it("startDate와 endDate가 같으면 통과한다", () => {
    expect(basicSearchSchema.safeParse({ ...valid, startDate: "2023-01-01", endDate: "2023-01-01" }).success).toBe(true);
  });
});

describe("advancedSearchSchema", () => {
  it("모든 필드가 없어도 통과한다", () => {
    expect(advancedSearchSchema.safeParse({}).success).toBe(true);
  });

  it("일부 필드만 있어도 통과한다", () => {
    expect(advancedSearchSchema.safeParse({ companyName: "LG전자" }).success).toBe(true);
  });

  it("startDate와 endDate 모두 있고 순서가 맞으면 통과한다", () => {
    expect(
      advancedSearchSchema.safeParse({ startDate: "2020-01-01", endDate: "2024-12-31" }).success
    ).toBe(true);
  });

  it("startDate와 endDate 모두 있고 순서가 틀리면 실패한다", () => {
    expect(
      advancedSearchSchema.safeParse({ startDate: "2024-12-31", endDate: "2020-01-01" }).success
    ).toBe(false);
  });

  it("startDate만 있을 때는 날짜 순서 검증을 하지 않는다", () => {
    expect(advancedSearchSchema.safeParse({ startDate: "2024-12-31" }).success).toBe(true);
  });

  it("endDate만 있을 때는 날짜 순서 검증을 하지 않는다", () => {
    expect(advancedSearchSchema.safeParse({ endDate: "2020-01-01" }).success).toBe(true);
  });
});
