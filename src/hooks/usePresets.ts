import { useState, useEffect } from "react";
import {
  getPresetsApi,
  getPresetDetailApi,
  createPresetApi,
  updatePresetApi,
  deletePresetApi,
} from "../api/preset";
import type { SearchPreset, PresetResponse } from "../types/preset";

export function usePresets() {
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getPresetsApi(0, 10);

      const mapped = data.map(
        (p: PresetResponse): SearchPreset => ({
          id: p.id.toString(),
          name: p.presetName,
          applicant: p.applicant,
          startDate: p.startDate,
          endDate: p.endDate,
          description: p.description || "",
          createdAt: p.createdAt,
        })
      );

      setPresets(mapped);
    } catch (err) {
      console.error(err);
      setError("프리셋 조회 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresetDetail = async (id: string): Promise<SearchPreset | null> => {
    try {
      const data = await getPresetDetailApi(Number(id));
      if (!data) return null;

      return {
        id: data.id.toString(),
        name: data.presetName,
        applicant: data.applicant,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description || "",
        createdAt: data.createdAt,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addOrUpdatePreset = async (preset: SearchPreset) => {
    try {
      setError(null);

      const exists = !isNaN(Number(preset.id)); // 숫자면 존재하는 프리셋

      if (exists) {
        await updatePresetApi(Number(preset.id), {
          presetName: preset.name,
          applicant: preset.applicant,
          startDate: preset.startDate,
          endDate: preset.endDate,
          description: preset.description,
        });
      } else {
        await createPresetApi({
          presetName: preset.name,
          applicant: preset.applicant,
          startDate: preset.startDate,
          endDate: preset.endDate,
          description: preset.description,
        });
      }

      await loadPresets();
    } catch (err) {
      console.error(err);
      setError("프리셋 저장 중 오류가 발생했습니다.");
    }
  };

  const removePreset = async (id: string) => {
    try {
      await deletePresetApi(Number(id));
      await loadPresets();
    } catch (err) {
      console.error(err);
      setError("프리셋 삭제 중 오류가 발생했습니다.");
    }
  };

  return {
    presets,
    isLoading,
    error,
    addOrUpdatePreset,
    deletePreset: removePreset,
    loadPresetDetail,
  };
}
