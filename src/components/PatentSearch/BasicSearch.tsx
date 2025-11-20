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
  selectedPresetId: string;
  onPresetChange: (id: string) => void;
}

export default function BasicSearch({
  onSearch,
  initialValues,
  selectedPresetId,
  onPresetChange,
}: BasicSearchProps) {
  return (
    <SearchForm
      onSearch={onSearch}
      title="기본 검색"
      enablePresets={true}
      initialValues={initialValues}
      selectedPresetId={selectedPresetId}
      onPresetChange={onPresetChange}
      showTitle={false}
    />
  );
}
