import SearchForm from "../common/SearchForm";

interface BasicSearchProps {
  onSearch: (params: {
    applicant: string;
    startDate: string;
    endDate: string;
  }) => void;
  initialValues?: {
    applicant?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function BasicSearch({
  onSearch,
  initialValues,
}: BasicSearchProps) {
  return (
    <SearchForm
      onSearch={onSearch}
      title="기본 검색"
      enablePresets={true}
      storageKey="patentPresets"
      initialValues={initialValues}
    />
  );
}
