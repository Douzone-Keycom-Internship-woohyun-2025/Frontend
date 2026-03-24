import { useMemo, useState } from "react";
import type { SummaryData } from "@/types/summary";
import { useNavigate } from "react-router-dom";
import RecentPatentCard from "./RecentPatentCard";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/utils/exportCsv";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler,
} from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler
);

const renderSection = (
  condition: boolean,
  content: React.ReactNode,
  message: string
) => (condition ? content : <EmptyState title={message} />);

interface SummaryDashboardProps {
  data: SummaryData;
  presetFilters?: { applicant?: string; startDate?: string; endDate?: string };
}

const IPC_COLORS = [
  "#003675", "#059669", "#F97316", "#DC2626", "#7C3AED",
  "#0891B2", "#CA8A04", "#BE185D", "#4F46E5", "#16A34A",
];

export default function SummaryDashboard({
  data,
  presetFilters,
}: SummaryDashboardProps) {
  const navigate = useNavigate();
  const [showAllIpc, setShowAllIpc] = useState(false);

  const handleViewPatents = () => {
    navigate("/patent-search", {
      replace: false,
      state: {
        fromSummary: true,
        filters: {
          applicant: presetFilters?.applicant || "",
          startDate: presetFilters?.startDate || "",
          endDate: presetFilters?.endDate || "",
        },
      },
    });
  };

  const totalPatents = data?.statistics?.totalPatents || 0;
  const ipcData = data?.ipcDistribution || [];
  const monthlyData = data?.monthlyTrend || [];
  const statusData = data?.statusDistribution || [];
  const registrationRate = data?.statistics?.registrationRate ?? 0;

  const sortedIpc = useMemo(
    () => [...ipcData].sort((a, b) => b.count - a.count),
    [ipcData]
  );
  const topIpcCodes = useMemo(
    () => sortedIpc.slice(0, 5),
    [sortedIpc]
  );
  const displayedIpc = showAllIpc ? sortedIpc : topIpcCodes;

  // Growth rate: compare last 3 months average vs previous 3 months
  const growthRate = useMemo(() => {
    if (monthlyData.length < 4) return null;
    const recent = monthlyData.slice(-3);
    const previous = monthlyData.slice(-6, -3);
    if (previous.length === 0) return null;
    const recentAvg = recent.reduce((s, m) => s + m.count, 0) / recent.length;
    const prevAvg = previous.reduce((s, m) => s + m.count, 0) / previous.length;
    if (prevAvg === 0) return null;
    return Number((((recentAvg - prevAvg) / prevAvg) * 100).toFixed(1));
  }, [monthlyData]);

  const ipcChartData = useMemo(
    () => ({
      labels: topIpcCodes.map((item) => item.ipcCode),
      datasets: [
        {
          data: topIpcCodes.map((item) => item.count),
          backgroundColor: IPC_COLORS.slice(0, 5),
          borderWidth: 1,
        },
      ],
    }),
    [topIpcCodes]
  );

  // Monthly chart: bar + cumulative line (use ALL months)
  const monthlyChartData = useMemo(() => {
    const cumulativeCounts = monthlyData.map((m) => m.cumulativeCount);

    return {
      labels: monthlyData.map((m) => m.month),
      datasets: [
        {
          type: "bar" as const,
          label: "월별 출원",
          data: monthlyData.map((m) => m.count),
          backgroundColor: "#003675",
          borderRadius: 4,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "누적 건수",
          data: cumulativeCounts,
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 4,
          borderWidth: 2,
          yAxisID: "y1",
          order: 1,
        },
      ],
    };
  }, [monthlyData]);

  const statusChartData = useMemo(
    () => ({
      labels: statusData.map((s) => s.status || "정보 없음"),
      datasets: [
        {
          data: statusData.map((s) => s.count),
          backgroundColor: [
            "#22C55E",
            "#003f9e",
            "#EAB308",
            "#EF4444",
            "#9CA3AF",
          ],
          borderWidth: 0,
          hoverOffset: 0,
        },
      ],
    }),
    [statusData]
  );

  const handleExportCsv = () => {
    const headers = ["항목", "값"];
    const rows: string[][] = [
      ["총 특허 건수", String(totalPatents)],
      ["등록률", `${registrationRate}%`],
      ["월평균 출원", String(data.statistics.monthlyAverage)],
      [],
      ["--- IPC 분포 ---", ""],
      ...sortedIpc.map((ipc) => [
        `${ipc.ipcCode} (${ipc.ipcName})`,
        `${ipc.count}건 (${ipc.percentage}%)`,
      ]),
      [],
      ["--- 월별 동향 ---", ""],
      ...monthlyData.map((m) => [m.month, `${m.count}건`]),
      [],
      ["--- 상태 분포 ---", ""],
      ...statusData.map((s) => [s.status, `${s.count}건 (${s.percentage}%)`]),
    ];
    downloadCsv("요약분석", headers, rows);
  };

  const statCards = [
    {
      label: "총 특허 건수",
      value: totalPatents.toLocaleString(),
      icon: "ri-file-text-line",
      iconBg: "bg-brand-100",
      iconColor: "text-brand-700",
      sub: null as string | null,
    },
    {
      label: "등록률",
      value: `${registrationRate}%`,
      icon: "ri-check-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      sub: null as string | null,
    },
    {
      label: "월평균 출원",
      value: data.statistics.monthlyAverage,
      icon: "ri-calendar-line",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      sub:
        growthRate !== null
          ? growthRate >= 0
            ? `+${growthRate}% 증가 추세`
            : `${growthRate}% 감소 추세`
          : null,
      subColor: growthRate !== null && growthRate >= 0 ? "text-green-600" : "text-red-500",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8">
      {/* CSV 내보내기 헤더 */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i className="ri-download-2-line" />
          CSV 내보내기
        </button>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {card.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
                {card.sub && (
                  <p className={`text-xs mt-1 font-medium ${(card as { subColor?: string }).subColor || "text-gray-500"}`}>
                    {card.sub}
                  </p>
                )}
              </div>
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}
              >
                <i
                  className={`${card.icon} ${card.iconColor} text-xl sm:text-2xl`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* IPC 분포 — 확장 가능 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            IPC 코드별 기술분야 분포
          </h3>
          {sortedIpc.length > 5 && (
            <button
              onClick={() => setShowAllIpc(!showAllIpc)}
              className="text-xs sm:text-sm text-brand-700 hover:text-brand-800 font-medium"
            >
              {showAllIpc ? "상위 5개만 보기" : `전체 ${sortedIpc.length}개 보기`}
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          특허 출원 IPC 코드를 기준으로 비율을 표시합니다.
        </p>

        {renderSection(
          ipcData.length > 0 && totalPatents > 0,
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-56 sm:h-72 relative flex justify-center items-center">
              <Pie
                data={ipcChartData}
                options={{
                  plugins: { legend: { position: "bottom" } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

            <div className="flex flex-col space-y-2 sm:space-y-2.5 max-h-80 overflow-y-auto">
              {displayedIpc.map((item, index) => (
                <div
                  key={item.ipcCode}
                  className="flex justify-between bg-gray-50 px-3 sm:px-4 py-2 rounded-lg"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: IPC_COLORS[index % IPC_COLORS.length],
                      }}
                    />
                    <span className="text-xs sm:text-sm text-gray-800 font-medium truncate">
                      {item.ipcCode}
                      {item.ipcName && (
                        <span className="text-gray-500 font-normal ml-1.5">
                          {item.ipcName}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 shrink-0 ml-2">
                    {item.count}건 ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>,
          "IPC 코드 데이터가 없습니다."
        )}
      </div>

      {/* 월별 동향 (전체 기간 + 누적 라인) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
          월별 특허 출원 동향
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          전체 기간의 월별 출원 건수와 누적 증가 추이를 함께 표시합니다.
        </p>

        {renderSection(
          monthlyData.length > 0,
          <div className="h-64 sm:h-80 relative">
            <Chart
              type="bar"
              data={monthlyChartData}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { mode: "index", intersect: false },
                },
                interaction: { mode: "index", intersect: false },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#4B5563", font: { size: 10 }, maxRotation: 45 },
                  },
                  y: {
                    type: "linear",
                    position: "left",
                    beginAtZero: true,
                    title: { display: true, text: "월별 출원", font: { size: 11 } },
                    ticks: { precision: 0, color: "#4B5563", font: { size: 10 } },
                  },
                  y1: {
                    type: "linear",
                    position: "right",
                    beginAtZero: true,
                    title: { display: true, text: "누적 건수", font: { size: 11 } },
                    ticks: { precision: 0, color: "#059669", font: { size: 10 } },
                    grid: { drawOnChartArea: false },
                  },
                },
              }}
            />
          </div>,
          "월별 출원 데이터가 없습니다."
        )}
      </div>

      {/* 상태 분포 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          등록 상태별 분포
        </h3>

        {renderSection(
          statusData.length > 0,
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-56 sm:h-72 relative flex items-center justify-center">
              <Doughnut
                data={statusChartData}
                options={{
                  plugins: { legend: { position: "bottom" } },
                  cutout: "70%",
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] sm:text-xs text-gray-500 leading-none">
                  등록률
                </span>
                <span className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900 leading-none">
                  {registrationRate}%
                </span>
              </div>
            </div>

            {/* 상태별 상세 리스트 */}
            <div className="flex flex-col justify-center space-y-2.5">
              {statusData.map((s) => {
                const pct = totalPatents > 0 ? ((s.count / totalPatents) * 100).toFixed(1) : "0";
                return (
                  <div key={s.status} className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      {s.status || "정보 없음"}
                    </span>
                    <span className="text-sm text-gray-600">
                      {s.count}건 ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>,
          "등록 상태 데이터가 없습니다."
        )}
      </div>

      {/* 최근 특허 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            최근 주요 특허
          </h3>
          <Button size="sm" onClick={handleViewPatents}>
            검색된 특허 보기
          </Button>
        </div>

        {renderSection(
          data.recentPatents.length > 0,
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {data.recentPatents.slice(0, 3).map((patent) => (
              <RecentPatentCard
                key={patent.applicationNumber}
                patent={patent}
              />
            ))}
          </div>,
          "최근 특허 데이터가 없습니다."
        )}
      </div>
    </div>
  );
}
