import { useState, useEffect } from "react";

interface SearchFormParams {
  applicant: string;
  startDate: string;
  endDate: string;
}

interface PresetItem {
  id: string;
  name: string;
  applicant: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface SearchFormProps {
  onSearch: (params: SearchFormParams) => void;
  enablePresets?: boolean;
  storageKey?: string;
  title?: string;
  loading?: boolean;
  initialValues?: Partial<SearchFormParams>;
}

export default function SearchForm({
  onSearch,
  enablePresets = false,
  storageKey = "searchPresets",
  title = "검색",
  loading = false,
  initialValues, // ✅ props로 받기
}: SearchFormProps) {
  const [formData, setFormData] = useState<SearchFormParams>({
    applicant: "",
    startDate: "",
    endDate: "",
  });
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("");

  // ✅ 프리셋 불러오기
  useEffect(() => {
    if (!enablePresets) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) setPresets(JSON.parse(saved));
  }, [enablePresets, storageKey]);

  // ✅ 요약분석 → 검색페이지 이동 시 전달된 initialValues 자동 반영
  useEffect(() => {
    if (initialValues) {
      setFormData({
        applicant: initialValues.applicant || "",
        startDate: initialValues.startDate || "",
        endDate: initialValues.endDate || "",
      });
    }
  }, [initialValues]);

  // ✅ 입력값 변경
  const handleChange = (field: keyof SearchFormParams, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ 검색 버튼 클릭
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicant.trim()) {
      alert("회사명을 입력하세요!");
      return;
    }
    onSearch(formData);
  };

  // ✅ 프리셋 선택
  const handleSelectPreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (preset) {
      setFormData({
        applicant: preset.applicant,
        startDate: preset.startDate,
        endDate: preset.endDate,
      });
      setSelectedPreset(id);
    }
  };

  // ✅ 프리셋 저장
  const handleSavePreset = () => {
    if (!presetName.trim() || !formData.applicant.trim()) {
      alert("프리셋명과 회사명을 입력하세요.");
      return;
    }

    const newPreset: PresetItem = {
      id: Date.now().toString(),
      name: presetName,
      applicant: formData.applicant,
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setPresets(updated);
    setPresetName("");
    setShowSaveModal(false);
    alert("프리셋이 저장되었습니다!");
  };

  // ✅ 프리셋 삭제
  const handleDeletePreset = (id: string) => {
    if (!window.confirm("프리셋을 삭제하시겠습니까?")) return;
    const updated = presets.filter((p) => p.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setPresets(updated);
    if (selectedPreset === id) setSelectedPreset("");
  };

  // ✅ 초기화
  const handleReset = () => {
    setFormData({ applicant: "", startDate: "", endDate: "" });
    setSelectedPreset("");
  };

  // ✅ 렌더링
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

        {/* 🔹 프리셋 선택 영역 */}
        {enablePresets && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              저장된 프리셋
            </label>
            <div className="flex gap-2">
              <select
                value={selectedPreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">프리셋 선택</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.applicant})
                  </option>
                ))}
              </select>
              {selectedPreset && (
                <button
                  type="button"
                  onClick={() => handleDeletePreset(selectedPreset)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        )}

        {/* 🔹 입력 영역 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회사명
            </label>
            <input
              type="text"
              placeholder="예: 삼성, LG, 네이버"
              value={formData.applicant}
              onChange={(e) => handleChange("applicant", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작 날짜
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료 날짜
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 🔹 버튼 영역 */}
        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "검색 중..." : "검색"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            초기화
          </button>
          {enablePresets && (
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              프리셋 저장
            </button>
          )}
        </div>
      </form>

      {/* 🔹 프리셋 저장 모달 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h4 className="text-lg font-semibold mb-3">프리셋 저장</h4>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="프리셋 이름 입력"
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSavePreset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
