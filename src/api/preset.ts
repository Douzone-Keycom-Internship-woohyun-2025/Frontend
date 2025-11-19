import api from "./axiosInstance";

export async function getPresetsApi(skip = 0, limit = 10) {
  const res = await api.get(`/presets?skip=${skip}&limit=${limit}`);
  return res.data.data.presets;
}

export async function getPresetDetailApi(id: number) {
  const res = await api.get(`/presets/${id}`);
  return res.data.data;
}

export async function createPresetApi(payload: {
  presetName: string;
  applicant: string;
  startDate: string;
  endDate: string;
  description?: string;
}) {
  const res = await api.post("/presets", payload);
  return res.data.data;
}

export async function updatePresetApi(
  id: number,
  payload: {
    presetName: string;
    applicant: string;
    startDate: string;
    endDate: string;
    description?: string;
  }
) {
  return api.patch(`/presets/${id}`, payload);
}

export async function deletePresetApi(id: number) {
  return api.delete(`/presets/${id}`);
}
