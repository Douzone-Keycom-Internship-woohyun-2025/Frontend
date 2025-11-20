import api from "./axiosInstance";
import type {
  PatentListResponse,
  PatentDetail,
  BasicPatentSearchParams,
  AdvancedPatentSearchParams,
} from "../types/patent";

export async function searchPatentBasic(
  params: BasicPatentSearchParams
): Promise<PatentListResponse> {
  const res = await api.post("/patents/search/basic", params);
  return res.data.data;
}

export async function searchPatentAdvanced(
  params: AdvancedPatentSearchParams
): Promise<PatentListResponse> {
  const res = await api.post("/patents/search/advanced", params);
  return res.data.data;
}

export async function getPatentDetail(
  applicationNumber: string
): Promise<PatentDetail> {
  const res = await api.get(`/patents/${applicationNumber}`);
  return res.data.data;
}
