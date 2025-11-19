export interface PresetResponse {
  id: number;
  presetName: string;
  applicant: string;
  startDate: string;
  endDate: string;
  description?: string;
  createdAt: string;
}

export interface SearchPreset {
  id: string;
  name: string;
  applicant: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  description?: string;
}
