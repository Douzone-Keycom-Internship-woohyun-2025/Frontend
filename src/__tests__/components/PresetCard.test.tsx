import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PresetCard from "@/components/preset/PresetCard";
import type { SearchPreset } from "@/types/preset";

const mockPreset: SearchPreset = {
  id: "preset-1",
  name: "삼성 특허 모니터링",
  applicant: "삼성전자",
  startDate: "20200101",
  endDate: "20241231",
  createdAt: "2024-01-15T00:00:00Z",
};

function setup(overrides: Partial<SearchPreset> = {}) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onUse = vi.fn();
  const preset = { ...mockPreset, ...overrides };
  render(<PresetCard preset={preset} onEdit={onEdit} onDelete={onDelete} onUse={onUse} />);
  return { onEdit, onDelete, onUse, preset };
}

describe("PresetCard — 렌더링", () => {
  it("프리셋 이름과 출원인을 표시한다", () => {
    setup();
    expect(screen.getByText("삼성 특허 모니터링")).toBeInTheDocument();
    expect(screen.getByText("삼성전자")).toBeInTheDocument();
  });

  it("날짜를 YYYY.MM.DD 형식으로 표시한다", () => {
    setup();
    expect(screen.getByText(/2020\.01\.01/)).toBeInTheDocument();
    expect(screen.getByText(/2024\.12\.31/)).toBeInTheDocument();
  });

  it("description이 있으면 표시한다", () => {
    setup({ description: "반도체 관련 특허 추적용" });
    expect(screen.getByText("반도체 관련 특허 추적용")).toBeInTheDocument();
  });

  it("description이 없으면 설명 문단이 표시되지 않는다", () => {
    setup({ description: undefined });
    // <p> 태그는 생성일 1개만 존재해야 함 (설명 문단 없음)
    const paragraphs = screen.getAllByRole("paragraph");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent("생성");
  });

  it("날짜가 없으면 날짜 영역을 렌더링하지 않는다", () => {
    setup({ startDate: "", endDate: "" });
    expect(screen.queryByText(/~/)).not.toBeInTheDocument();
  });
});

describe("PresetCard — 인터랙션", () => {
  it("편집 버튼 클릭 시 onEdit이 프리셋 객체와 함께 호출된다", async () => {
    const user = userEvent.setup();
    const { onEdit } = setup();
    await user.click(screen.getByTitle("편집"));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: "preset-1" }));
  });

  it("분석하기 클릭 시 onUse가 YYYY-MM-DD 형식 날짜와 함께 호출된다", async () => {
    const user = userEvent.setup();
    const { onUse } = setup();
    await user.click(screen.getByRole("button", { name: /분석하기/ }));
    expect(onUse).toHaveBeenCalledTimes(1);
    expect(onUse).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: "2020-01-01",
        endDate: "2024-12-31",
      })
    );
  });

  it("삭제 버튼 클릭 시 확인 다이얼로그가 열린다", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTitle("삭제"));
    expect(screen.getByText("정말 삭제하시겠습니까?")).toBeInTheDocument();
    expect(screen.getByText("삭제된 프리셋은 복구할 수 없습니다.")).toBeInTheDocument();
  });

  it("다이얼로그에서 삭제 확인 시 onDelete가 preset.id와 함께 호출된다", async () => {
    const user = userEvent.setup();
    const { onDelete } = setup();
    await user.click(screen.getByTitle("삭제"));
    await user.click(screen.getByRole("button", { name: "삭제" }));
    expect(onDelete).toHaveBeenCalledWith("preset-1");
  });

  it("다이얼로그에서 취소 시 onDelete가 호출되지 않는다", async () => {
    const user = userEvent.setup();
    const { onDelete } = setup();
    await user.click(screen.getByTitle("삭제"));
    await user.click(screen.getByRole("button", { name: "취소" }));
    expect(onDelete).not.toHaveBeenCalled();
  });
});
