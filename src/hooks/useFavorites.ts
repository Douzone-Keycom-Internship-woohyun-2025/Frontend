import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavoritesApi,
  addFavoriteApi,
  deleteFavoriteApi,
} from "@/api/favorite";

import type { AddFavoritePayload } from "@/types/favorite";

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { favorites: list } = await getFavoritesApi();
      return list;
    },
  });

  const favoriteItems = data ?? [];
  const favorites = favoriteItems.map((f) => f.applicationNumber);
  const error = queryError ? "관심 특허 목록을 불러오는 중 오류가 발생했습니다." : null;

  const addMutation = useMutation({
    mutationFn: addFavoriteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFavoriteApi,
    onSuccess: (_data, applicationNumber) => {
      queryClient.setQueryData(
        ["favorites"],
        favoriteItems.filter((item) => item.applicationNumber !== applicationNumber)
      );
    },
  });

  const toggleFavorite = async (
    applicationNumber: string,
    payload?: AddFavoritePayload
  ) => {
    const isFav = favorites.includes(applicationNumber);

    if (!isFav) {
      if (!payload) {
        console.error("payload 없음 → 즐겨찾기 추가 불가");
        return;
      }
      await addMutation.mutateAsync(payload);
      return;
    }

    await deleteMutation.mutateAsync(applicationNumber);
  };

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  return { favorites, favoriteItems, toggleFavorite, loading, error, refetch };
}
