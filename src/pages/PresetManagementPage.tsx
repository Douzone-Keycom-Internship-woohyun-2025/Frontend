import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import type { SearchPreset } from "../types/preset";
import PresetCard from "../components/Preset/PresetCard";
import PresetModal from "../components/Preset/PresetModal";

export default function PresetManagementPage() {
  const navigate = useNavigate();
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<SearchPreset | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    applicant: "",
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
    if (!formData.name.trim() || !formData.applicant.trim()) {
      alert("프리셋명과 회사명은 필수입니다.");
      return;
    }

    const newPreset: SearchPreset = {
      id: editingPreset?.id || Date.now().toString(),
      name: formData.name,
      applicant: formData.applicant,
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
          applicant: preset.applicant,
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
        applicant: preset.applicant,
        startDate: preset.startDate,
        endDate: preset.endDate,
        description: preset.description || "",
      });
    } else {
      setEditingPreset(null);
      setFormData({
        name: "",
        applicant: "",
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
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6 flex justify-between items-center">
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
        <main className="px-8 py-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onEdit={handleOpenModal}
                  onDelete={handleDeletePreset}
                  onUse={handleUsePreset}
                />
              ))}
            </div>
          )}

          {/* 모달 */}
          <PresetModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSavePreset}
            formData={formData}
            setFormData={setFormData}
            editingPreset={editingPreset}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}
