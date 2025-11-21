import { useEffect, useState } from "react";
import {
  getFavoritesApi,
  addFavoriteApi,
  deleteFavoriteApi,
} from "../api/favorite";

import type { AddFavoritePayload } from "../types/favorite";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const { favorites: list } = await getFavoritesApi();
        setFavorites(list.map((f) => f.applicationNumber));
      } catch (err) {
        console.error("관심특허 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  const toggleFavorite = async (
    applicationNumber: string,
    payload?: AddFavoritePayload
  ) => {
    try {
      const isFav = favorites.includes(applicationNumber);

      if (!isFav) {
        if (!payload) {
          console.error("payload 없음 → 즐겨찾기 추가 불가");
          return;
        }

        await addFavoriteApi(payload);

        setFavorites((prev) => [...prev, applicationNumber]);
        return;
      }

      await deleteFavoriteApi(applicationNumber);

      setFavorites((prev) => prev.filter((num) => num !== applicationNumber));
    } catch (err) {
      console.error("관심특허 토글 실패:", err);
    }
  };

  return { favorites, toggleFavorite, loading };
}
