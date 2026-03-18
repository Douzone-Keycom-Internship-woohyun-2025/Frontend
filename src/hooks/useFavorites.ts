import { useEffect, useState } from "react";
import {
  getFavoritesApi,
  addFavoriteApi,
  deleteFavoriteApi,
} from "../api/favorite";

import type { AddFavoritePayload, FavoriteItem } from "../types/favorite";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const { favorites: list } = await getFavoritesApi();
      setFavorites(list.map((f) => f.applicationNumber));
      setFavoriteItems(list);
    } catch (err) {
      console.error("관심특허 로딩 실패:", err);
      setError("관심 특허 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      setFavoriteItems((prev) =>
        prev.filter((item) => item.applicationNumber !== applicationNumber)
      );
    } catch (err) {
      console.error("관심특허 토글 실패:", err);
    }
  };

  return { favorites, favoriteItems, toggleFavorite, loading, error, refetch: loadFavorites };
}
