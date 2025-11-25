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
  applicant: string;

  period: {
    startDate: string;
    endDate: string;
  };

  statistics: {
    totalPatents: number;
    monthlyAverage: number;
    registrationRate: number;
  };

  ipcDistribution: Array<{
    ipcCode: string;
    ipcKorName: string;
    count: number;
  }>;

  statusDistribution: Array<{
    status: string;
    count: number;
  }>;

  monthlyTrend: Array<{
    month: string;
    count: number;
  }>;

  recentPatents: Array<{
    applicationNumber: string;
    title: string;
    date: string;
    ipcMain: string;
    ipcKorName: string;
    status: string;
  }>;
}
