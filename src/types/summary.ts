export interface BackendSummaryResponse {
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
    ipcMain: string | null;
    ipcKorName: string;
    status: string;
  }>;
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

  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;

  monthlyTrend: Array<{
    month: string;
    count: number;
    cumulativeCount: number;
  }>;

  recentPatents: Array<{
    applicationNumber: string;
    title: string;
    date: string;
    ipcMain: string | null;
    ipcKorName: string;
    status: string;
  }>;
}
