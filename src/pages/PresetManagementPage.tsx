import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import PresetCard from "@/components/preset/PresetCard";
import PresetModal from "@/components/preset/PresetModal";
import { SkeletonPresetCards } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import { usePresets } from "@/hooks/usePresets";
import type { SearchPreset } from "@/types/preset";
import { useToast } from "@/hooks/use-toast";
import { toInputDateFormat } from "@/utils/dateTransform";
import { Button } from "@/components/ui/button";

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
    refetch: refetchPresets,
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
        description: "프리셋명과 출원인은 필수입니다.",
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
      toast({ title: "삭제 완료", description: "프리셋이 삭제되었습니다." });
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
      setFormData({
        name: target.name,
        applicant: target.applicant,
        startDate: toInputDateFormat(target.startDate),
        endDate: toInputDateFormat(target.endDate),
        description: target.description || "",
      });
    } else {
      setEditingPreset(null);
      setFormData({ name: "", applicant: "", startDate: "", endDate: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPreset(null);
  };

  return (
    <ProtectedLayout>
      <div className="w-full bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                프리셋 관리
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                자주 사용하는 검색 조건을 프리셋으로 저장하고 관리하세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs text-gray-400">
                {presets.length}개 프리셋
              </span>
              <Button onClick={() => handleOpenModal()} className="h-9">
                <i className="ri-add-line mr-1.5" />
                새 프리셋
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {isLoading ? (
            <SkeletonPresetCards count={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetchPresets} />
          ) : presets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 rounded-full flex items-center justify-center">
                <i className="ri-bookmark-line text-2xl text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                저장된 프리셋이 없습니다
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                자주 사용하는 검색 조건을 프리셋으로 저장해보세요.
              </p>
              <Button onClick={() => handleOpenModal()}>
                <i className="ri-add-line mr-1.5" />
                첫 프리셋 만들기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
