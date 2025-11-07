import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PresetCard from "../components/Preset/PresetCard";
import PresetModal from "../components/Preset/PresetModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import NoData from "../components/common/NoData";
import { usePresets } from "../hooks/usePresets";
import type { SearchPreset } from "../types/preset";

export default function PresetManagementPage() {
  const navigate = useNavigate();
  const { presets, isLoading, error, addOrUpdatePreset, deletePreset } =
    usePresets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<SearchPreset | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    applicant: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSavePreset = () => {
    if (!formData.name.trim() || !formData.applicant.trim()) {
      alert("프리셋명과 회사명은 필수입니다.");
      return;
    }

    const preset: SearchPreset = {
      id: editingPreset?.id || Date.now().toString(),
      name: formData.name,
      applicant: formData.applicant,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      createdAt: editingPreset?.createdAt || new Date().toISOString(),
    };

    addOrUpdatePreset(preset);
    handleCloseModal();
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

  // 로딩 상태
  if (isLoading) {
    return (
      <ProtectedLayout>
        <LoadingSpinner message="프리셋을 불러오는 중..." />
      </ProtectedLayout>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <ProtectedLayout>
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="w-full bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                프리셋 관리
              </h1>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                자주 사용하는 검색 조건을 프리셋으로 저장하고 관리하세요.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="
                w-full md:w-auto
                inline-flex items-center justify-center
                px-4 py-2
                bg-blue-600 text-white
                text-sm font-medium
                rounded-lg
                hover:bg-blue-700
                transition-colors duration-200
              "
            >
              <i className="ri-add-line mr-2" />새 프리셋
            </button>
          </div>
        </header>

        {/* 메인 */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {presets.length === 0 ? (
            <NoData
              message="저장된 프리셋이 없습니다."
              subMessage="자주 사용하는 검색 조건을 프리셋으로 저장해보세요."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onEdit={handleOpenModal}
                  onDelete={deletePreset}
                  onUse={handleUsePreset}
                />
              ))}
            </div>
          )}
        </main>

        {/* 모달 */}
        <PresetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePreset}
          formData={formData}
          setFormData={setFormData}
          editingPreset={editingPreset}
        />
      </div>
    </ProtectedLayout>
  );
}
