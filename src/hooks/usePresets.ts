import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPresetsApi,
  getPresetDetailApi,
  createPresetApi,
  updatePresetApi,
  deletePresetApi,
} from "@/api/preset";
import type { SearchPreset, PresetResponse } from "@/types/preset";

function mapPreset(p: PresetResponse): SearchPreset {
  return {
    id: p.id.toString(),
    name: p.presetName,
    applicant: p.applicant,
    startDate: p.startDate,
    endDate: p.endDate,
    description: p.description || "",
    createdAt: p.createdAt,
  };
}

export function usePresets() {
  const queryClient = useQueryClient();

  const { data: presets = [] as SearchPreset[], isLoading, error: queryError } = useQuery<SearchPreset[]>({
    queryKey: ["presets"],
    queryFn: async () => {
      const data = await getPresetsApi(0, 10);
      return data.map(mapPreset);
    },
  });

  const error = queryError ? "프리셋 조회 중 오류가 발생했습니다." : null;

  const loadPresetDetail = async (id: string): Promise<SearchPreset | null> => {
    try {
      const data = await getPresetDetailApi(Number(id));
      if (!data) return null;
      return mapPreset(data);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (preset: SearchPreset) => {
      const isNew = !preset.id || preset.id.startsWith("temp_");
      const body = {
        presetName: preset.name,
        applicant: preset.applicant,
        startDate: preset.startDate,
        endDate: preset.endDate,
        description: preset.description,
      };

      if (isNew) {
        await createPresetApi(body);
      } else {
        await updatePresetApi(Number(preset.id), body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deletePresetApi(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  const addOrUpdatePreset = async (preset: SearchPreset) => {
    await saveMutation.mutateAsync(preset);
  };

  const removePreset = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    presets,
    isLoading,
    error,
    addOrUpdatePreset,
    deletePreset: removePreset,
    loadPresetDetail,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["presets"] }),
  };
}
