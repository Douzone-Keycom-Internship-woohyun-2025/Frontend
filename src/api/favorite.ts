import api from "./axiosInstance";
import type {
  AddFavoritePayload,
  GetFavoritesResponse,
  FavoriteItem,
  FavoriteAnalysis,
} from "@/types/favorite";

export async function getFavoritesApi(): Promise<GetFavoritesResponse> {
  const res = await api.get("/favorites");
  return res.data.data;
}

export async function addFavoriteApi(
  payload: AddFavoritePayload
): Promise<FavoriteItem> {
  const res = await api.post("/favorites", payload);
  return res.data.data as FavoriteItem;
}

export async function deleteFavoriteApi(
  applicationNumber: string
): Promise<{ success: boolean }> {
  const res = await api.delete(`/favorites/${applicationNumber}`);
  return res.data.data as { success: boolean };
}

export async function updateFavoriteMemoApi(
  applicationNumber: string,
  memo: string | null
): Promise<void> {
  await api.patch(`/favorites/${applicationNumber}`, { memo });
}

export async function getFavoriteAnalysisApi(): Promise<FavoriteAnalysis> {
  const res = await api.get("/favorites/analysis");
  return res.data.data;
}
