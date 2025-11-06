import { useState, useEffect } from "react";
import type { SearchPreset } from "../types/preset";

export function usePresets() {
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("searchPresets");
      if (saved) setPresets(JSON.parse(saved));
    } catch (err) {
      console.error(err);
      setError("프리셋 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePresets = (newList: SearchPreset[]) => {
    localStorage.setItem("searchPresets", JSON.stringify(newList));
    setPresets(newList);
  };

  const addOrUpdatePreset = (preset: SearchPreset) => {
    const exists = presets.some((p) => p.id === preset.id);
    const newList = exists
      ? presets.map((p) => (p.id === preset.id ? preset : p))
      : [...presets, preset];
    savePresets(newList);
  };

  const deletePreset = (id: string) => {
    const newList = presets.filter((p) => p.id !== id);
    savePresets(newList);
  };

  return {
    presets,
    isLoading,
    error,
    addOrUpdatePreset,
    deletePreset,
  };
}
