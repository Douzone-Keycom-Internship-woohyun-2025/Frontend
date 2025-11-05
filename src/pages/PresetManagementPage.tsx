import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";

export interface SearchPreset {
  id: string;
  name: string;
  companyName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  description?: string;
}

export default function PresetManagementPage() {
  const navigate = useNavigate();
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<SearchPreset | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("searchPresets");
    if (saved) setPresets(JSON.parse(saved));
  }, []);

  const savePresets = (newList: SearchPreset[]) => {
    localStorage.setItem("searchPresets", JSON.stringify(newList));
    setPresets(newList);
  };

  const handleSavePreset = () => {
    if (!formData.name.trim() || !formData.companyName.trim()) {
      alert("프리셋명과 회사명은 필수입니다.");
      return;
    }

    const newPreset: SearchPreset = {
      id: editingPreset?.id || Date.now().toString(),
      name: formData.name,
      companyName: formData.companyName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      createdAt: editingPreset?.createdAt || new Date().toISOString(),
    };

    const newList = editingPreset
      ? presets.map((p) => (p.id === editingPreset.id ? newPreset : p))
      : [...presets, newPreset];

    savePresets(newList);
    handleCloseModal();
  };

  const handleDeletePreset = (id: string) => {
    if (!confirm("이 프리셋을 삭제하시겠습니까?")) return;
    const newList = presets.filter((p) => p.id !== id);
    savePresets(newList);
  };

  const handleUsePreset = (preset: SearchPreset) => {
    navigate("/summary", {
      state: {
        preset: {
          companyName: preset.companyName,
          startDate: preset.startDate,
          endDate: preset.endDate,
        },
      },
    });
  };

  const handleOpenModal = (preset?: SearchPreset) => {
    if (preset) {
      setEditingPreset(preset);
      setFormData({
        name: preset.name,
        companyName: preset.companyName,
        startDate: preset.startDate,
        endDate: preset.endDate,
        description: preset.description || "",
      });
    } else {
      setEditingPreset(null);
      setFormData({
        name: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPreset(null);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 ml-64">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">프리셋 관리</h1>
              <p className="mt-2 text-gray-600">
                자주 사용하는 검색 조건을 프리셋으로 저장하고 관리하세요.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <i className="ri-add-line mr-2"></i>새 프리셋
            </button>
          </div>
        </header>

        {/* 메인 */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {presets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-bookmark-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                저장된 프리셋이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                자주 사용하는 검색 조건을 프리셋으로 저장해보세요.
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <i className="ri-add-line mr-2"></i>첫 번째 프리셋 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white rounded-lg shadow hover:shadow-md p-6 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {preset.name}
                      </h3>
                      {preset.description && (
                        <p className="text-sm text-gray-600">
                          {preset.description}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(preset)}
                        className="text-gray-400 hover:text-gray-600"
                        title="편집"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="삭제"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <div>
                      <strong>회사:</strong> {preset.companyName}
                    </div>
                    {preset.startDate && (
                      <div>
                        <strong>시작일:</strong> {preset.startDate}
                      </div>
                    )}
                    {preset.endDate && (
                      <div>
                        <strong>종료일:</strong> {preset.endDate}
                      </div>
                    )}
                    <div className="text-gray-500 text-xs">
                      생성일: {new Date(preset.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUsePreset(preset)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <i className="ri-search-line mr-2"></i>이 프리셋으로
                    분석하기
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingPreset ? "프리셋 편집" : "새 프리셋 만들기"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              {/* 입력 폼 */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="프리셋명"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, companyName: e.target.value }))
                  }
                  placeholder="회사명"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, startDate: e.target.value }))
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, endDate: e.target.value }))
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="설명 (선택사항)"
                  className="w-full border rounded-lg px-3 py-2 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleSavePreset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPreset ? "수정" : "저장"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
