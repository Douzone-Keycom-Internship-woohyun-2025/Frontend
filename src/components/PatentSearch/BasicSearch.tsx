import SearchForm from "../common/SearchForm";

interface BasicSearchProps {
  onSearch: (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function BasicSearch({ onSearch }: BasicSearchProps) {
  return (
    <SearchForm
      onSearch={onSearch}
      title="기본 검색"
      enablePresets={false} // 프리셋 기능은 비활성화
      storageKey="patentPresets"
    />
  );
}
