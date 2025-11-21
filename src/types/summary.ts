export interface BackendSummaryResponse {
  applicant: string;
  period: {
    startDate: string;
    endDate: string;
  };
  totalCount: number;

  statusCount: Record<string, number>;
  statusPercent: Record<string, number>;

  monthlyTrend: Array<{
    month: string;
    count: number;
  }>;

  topIPC: Array<{
    code: string;
    count: number;
  }>;

  avgMonthlyCount: number;

  recentPatents: Array<{
    applicationNumber: string;
    title: string;
    date: string;
    ipcMain: string;
    status: string;
  }>;
}

export interface SummaryApiResponse {
  status: "success" | "error";
  message: string;
  data: BackendSummaryResponse;
}

export interface SummaryData {
  statistics: {
    totalPatents: number;
    registrationRate: number;
    monthlyAverage: number;
    searchPeriod: {
      startDate: string;
      endDate: string;
    };
  };
  ipcDistribution: Array<{
    ipcCode: string;
    ipcName: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    cumulativeCount: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recentPatents: Array<{
    applicationNumber: string;
    inventionTitle: string;
    applicantName: string;
    applicationDate: string;
    ipcCode: string;
    registerStatus: string;
    isFavorite: boolean;
  }>;
}
