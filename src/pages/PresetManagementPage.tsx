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
import { useToast } from "@/hooks/use-toast";

export default function PresetManagementPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    presets,
    isLoading,
    error,
    addOrUpdatePreset,
    deletePreset,
    loadPresetDetail,
  } = usePresets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<SearchPreset | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    applicant: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSavePreset = async () => {
    if (!formData.name.trim() || !formData.applicant.trim()) {
      toast({
        title: "필수 입력 누락",
        description: "프리셋명과 회사명은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    const preset: SearchPreset = {
      id: editingPreset?.id || "temp_" + Date.now().toString(),
      name: formData.name,
      applicant: formData.applicant,
      startDate: formData.startDate.replaceAll("-", ""),
      endDate: formData.endDate.replaceAll("-", ""),
      description: formData.description,
      createdAt: editingPreset?.createdAt || new Date().toISOString(),
    };

    try {
      await addOrUpdatePreset(preset);

      toast({
        title: editingPreset ? "수정 완료" : "생성 완료",
        description: editingPreset
          ? "프리셋이 성공적으로 수정되었습니다."
          : "새 프리셋이 생성되었습니다.",
      });

      handleCloseModal();
    } catch {
      toast({
        title: "저장 실패",
        description: "프리셋 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePreset = async (id: string) => {
    try {
      await deletePreset(id);
      toast({
        title: "삭제 완료",
        description: "프리셋이 성공적으로 삭제되었습니다.",
      });
    } catch {
      toast({
        title: "삭제 실패",
        description: "프리셋 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleOpenModal = async (preset?: SearchPreset) => {
    if (preset) {
      const fullPreset = await loadPresetDetail(preset.id);
      const target = fullPreset ?? preset;

      setEditingPreset(target);

      const fmtStart =
        target.startDate.length === 8
          ? `${target.startDate.slice(0, 4)}-${target.startDate.slice(
              4,
              6
            )}-${target.startDate.slice(6, 8)}`
          : target.startDate;

      const fmtEnd =
        target.endDate.length === 8
          ? `${target.endDate.slice(0, 4)}-${target.endDate.slice(
              4,
              6
            )}-${target.endDate.slice(6, 8)}`
          : target.endDate;

      setFormData({
        name: target.name,
        applicant: target.applicant,
        startDate: fmtStart,
        endDate: fmtEnd,
        description: target.description || "",
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
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <i className="ri-add-line mr-2" />새 프리셋
            </button>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-10 flex justify-center">
              <LoadingSpinner message="프리셋을 불러오는 중..." size="md" />
            </div>
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={() => window.location.reload()}
            />
          ) : presets.length === 0 ? (
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
                  onDelete={handleDeletePreset}
                  onUse={() =>
                    navigate("/summary", {
                      state: {
                        preset: {
                          id: preset.id,
                          name: preset.name,
                          description: preset.description,
                          applicant: preset.applicant,
                          startDate: preset.startDate,
                          endDate: preset.endDate,
                          createdAt: preset.createdAt,
                        },
                      },
                    })
                  }
                />
              ))}
            </div>
          )}
        </main>

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
