import { useState, useEffect } from "react";
import { usePresets } from "../../hooks/usePresets";

interface SearchFormParams {
  applicant: string;
  startDate: string;
  endDate: string;
}

interface SearchFormProps {
  onSearch: (params: SearchFormParams) => void;
  enablePresets?: boolean;
  title?: string;
  loading?: boolean;
  initialValues?: Partial<SearchFormParams>;
  selectedPresetId: string;
  onPresetChange: (id: string) => void;
}

export default function SearchForm({
  onSearch,
  enablePresets = false,
  title = "검색",
  loading = false,
  initialValues,

  selectedPresetId,
  onPresetChange,
}: SearchFormProps) {
  const { presets, isLoading: presetLoading, error } = usePresets();

  const [formData, setFormData] = useState<SearchFormParams>({
    applicant: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        applicant: initialValues.applicant ?? "",
        startDate: initialValues.startDate ?? "",
        endDate: initialValues.endDate ?? "",
      });
    }
  }, [initialValues]);

  const handleSelectPreset = (presetId: string) => {
    onPresetChange(presetId);

    if (presetId === "") {
      setFormData({ applicant: "", startDate: "", endDate: "" });
      return;
    }

    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    const format = (v: string) =>
      v.length === 8 ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : v;

    setFormData({
      applicant: preset.applicant,
      startDate: format(preset.startDate),
      endDate: format(preset.endDate),
    });
  };

  const handleChange = (field: keyof SearchFormParams, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (selectedPresetId) {
        const preset = presets.find((p) => p.id === selectedPresetId);
        if (preset) {
          const format = (v: string) =>
            v.length === 8
              ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`
              : v;
          const presetDataMatches =
            preset.applicant === newData.applicant &&
            format(preset.startDate) === newData.startDate &&
            format(preset.endDate) === newData.endDate;

          if (!presetDataMatches) {
            onPresetChange("");
          }
        }
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicant.trim()) {
      alert("회사명을 입력하세요!");
      return;
    }

    onSearch({
      applicant: formData.applicant,
      startDate: formData.startDate.replace(/-/g, ""),
      endDate: formData.endDate.replace(/-/g, ""),
    });
  };

  const handleReset = () => {
    onPresetChange("");
    setFormData({ applicant: "", startDate: "", endDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
        {title}
      </h3>

      {enablePresets && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            저장된 프리셋
          </label>

          {presetLoading ? (
            <p className="text-sm text-gray-500">프리셋 로딩 중...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">프리셋 선택</option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">회사명</label>
          <input
            type="text"
            value={formData.applicant}
            onChange={(e) => handleChange("applicant", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="예: 삼성, LG, 네이버"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">시작 날짜</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">종료 날짜</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? "검색 중..." : "검색"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:flex-1 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          초기화
        </button>
      </div>
    </form>
  );
}
