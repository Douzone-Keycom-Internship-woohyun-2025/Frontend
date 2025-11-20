import { useEffect, useState } from "react";
import {
  getFavoritesApi,
  addFavoriteApi,
  deleteFavoriteApi,
} from "../api/favorite";

import type { PatentDetail } from "../types/patent";
import type { FavoriteItem, AddFavoritePayload } from "../types/favorite";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const { favorites: list } = await getFavoritesApi();

        setFavorites(list.map((f: FavoriteItem) => f.applicationNumber));
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
    detail?: PatentDetail
  ) => {
    try {
      const isFav = favorites.includes(applicationNumber);

      if (!isFav) {
        if (!detail) {
          console.error("상세정보 없음 → addFavorite 불가능");
          return;
        }

        const payload: AddFavoritePayload = {
          applicationNumber: detail.applicationNumber,
          inventionTitle: detail.inventionTitle,
          applicantName: detail.applicantName,
          abstract: detail.astrtCont ?? null,
          applicationDate: detail.applicationDate,
          openNumber: detail.openNumber ?? null,
          publicationNumber: detail.publicationNumber ?? null,
          publicationDate: detail.publicationDate ?? null,
          registerNumber: detail.registerNumber ?? null,
          registerDate: detail.registerDate ?? null,
          registerStatus: detail.registerStatus ?? null,
          drawingUrl: detail.drawing ?? null,
          ipcNumber: detail.ipcNumber ?? null,
          mainIpcCode: detail.mainIpcCode ?? null,
        };

        await addFavoriteApi(payload);

        setFavorites((prev) => [...prev, applicationNumber]);
        return;
      }

      await deleteFavoriteApi(applicationNumber);

      setFavorites((prev) => prev.filter((num) => num !== applicationNumber));
    } catch (err) {
      console.error("관심토글 실패:", err);
    }
  };

  return { favorites, toggleFavorite, loading };
}
