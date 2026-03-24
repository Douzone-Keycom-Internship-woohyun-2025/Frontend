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
import { Doughnut, Bar } from "react-chartjs-2";

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

interface SummaryDashboardProps {
  data: SummaryData;
  presetFilters?: { applicant?: string; startDate?: string; endDate?: string };
}

const IPC_COLORS = [
  "#003675", "#059669", "#F97316", "#DC2626", "#7C3AED",
  "#0891B2", "#CA8A04", "#BE185D", "#4F46E5", "#16A34A",
];

// 상태를 3그룹으로 분류
const STATUS_GROUP = (status: string) => {
  if (status === "등록") return "registered";
  if (status === "공개") return "pending";
  return "inactive";
};

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
  const topIpcCodes = useMemo(() => sortedIpc.slice(0, 5), [sortedIpc]);
  const displayedIpc = showAllIpc ? sortedIpc : topIpcCodes;

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

  // 가장 많이 출원된 달
  const peakMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return monthlyData.reduce((max, m) => (m.count > max.count ? m : max), monthlyData[0]);
  }, [monthlyData]);

  // 월별 바 차트 (단일 Y축)
  const monthlyBarData = useMemo(() => ({
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: "월별 출원",
        data: monthlyData.map((m) => m.count),
        backgroundColor: "#003675",
        borderRadius: 4,
      },
    ],
  }), [monthlyData]);

  // 상태 분포 도넛
  const statusChartData = useMemo(() => ({
    labels: statusData.map((s) => s.status || "정보 없음"),
    datasets: [
      {
        data: statusData.map((s) => s.count),
        backgroundColor: statusData.map((s) => {
          const g = STATUS_GROUP(s.status);
          if (g === "registered") return "#22C55E";
          if (g === "pending") return "#3B82F6";
          return "#D1D5DB";
        }),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }), [statusData]);

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

  // 인사이트 자연어 요약
  const insightText = useMemo(() => {
    const applicant = presetFilters?.applicant || "해당 출원인";
    const period =
      presetFilters?.startDate && presetFilters?.endDate
        ? `${presetFilters.startDate} ~ ${presetFilters.endDate} 기간`
        : "검색 기간";
    const topField = sortedIpc[0]?.ipcName || sortedIpc[0]?.ipcCode;
    const trendText =
      growthRate !== null
        ? growthRate >= 0
          ? `최근 출원이 ${growthRate}% 증가 추세입니다.`
          : `최근 출원이 ${Math.abs(growthRate)}% 감소 추세입니다.`
        : "";

    return `${applicant}은(는) ${period} 동안 총 ${totalPatents.toLocaleString()}건의 특허를 출원했으며, 등록률은 ${registrationRate}%입니다.${topField ? ` 주요 기술 분야는 ${topField}에 집중되어 있습니다.` : ""} ${trendText}`;
  }, [presetFilters, totalPatents, registrationRate, sortedIpc, growthRate]);

  const statCards = [
    {
      label: "총 특허 건수",
      value: totalPatents.toLocaleString(),
      unit: "건",
      desc: "검색 기간 내 출원된 전체 특허 수",
      icon: "ri-file-text-line",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-700",
      badge: null as React.ReactNode,
    },
    {
      label: "등록률",
      value: `${registrationRate}`,
      unit: "%",
      desc: "출원 대비 실제 등록된 비율 — 높을수록 기술 경쟁력 강함",
      icon: "ri-shield-check-line",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badge: null as React.ReactNode,
    },
    {
      label: "월평균 출원",
      value: String(data.statistics.monthlyAverage),
      unit: "건/월",
      desc: "한 달 평균 출원 건수",
      icon: "ri-calendar-line",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      badge:
        growthRate !== null ? (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              growthRate >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            <i className={growthRate >= 0 ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
            {Math.abs(growthRate)}%
          </span>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 인사이트 요약 바 */}
      <div className="flex items-start justify-between gap-4 bg-brand-50 border border-brand-100 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center shrink-0">
            <i className="ri-lightbulb-line text-white text-base" />
          </div>
          <p className="text-sm text-brand-900 leading-relaxed">{insightText}</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
        >
          <i className="ri-download-2-line" />
          <span className="hidden sm:inline">CSV</span>
        </button>
      </div>

      {/* 핵심 지표 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <i className={`${card.icon} ${card.iconColor} text-lg`} />
              </div>
              {card.badge}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 leading-none">
              {card.value}
              <span className="text-sm font-normal text-gray-400 ml-1">{card.unit}</span>
            </p>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* 기술 분야 분포 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-gray-900">기술 분야 분포</h3>
            <p className="text-xs text-gray-400 mt-0.5">어떤 기술 분야의 특허가 많은지 보여줍니다</p>
          </div>
          {sortedIpc.length > 5 && (
            <button
              onClick={() => setShowAllIpc(!showAllIpc)}
              className="text-xs text-brand-700 hover:text-brand-800 font-medium shrink-0"
            >
              {showAllIpc ? "상위 5개만" : `전체 ${sortedIpc.length}개`}
            </button>
          )}
        </div>

        {ipcData.length > 0 && totalPatents > 0 ? (
          <div className="mt-4 space-y-2">
            {displayedIpc.map((item, index) => (
              <div key={item.ipcCode} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: IPC_COLORS[index % IPC_COLORS.length] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-800 font-medium truncate">
                      {item.ipcName || item.ipcCode}
                      <span className="text-xs text-gray-400 font-normal ml-1.5">{item.ipcCode}</span>
                    </span>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{item.count}건 ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: IPC_COLORS[index % IPC_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="기술 분야 데이터가 없습니다." />
        )}
      </div>

      {/* 월별 출원 동향 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-1">
          <h3 className="text-base font-semibold text-gray-900">월별 출원 동향</h3>
          <p className="text-xs text-gray-400 mt-0.5">월별 특허 출원 건수 추이를 보여줍니다</p>
        </div>

        {monthlyData.length > 0 ? (
          <>
            <div className="h-56 mt-4">
              <Bar
                data={monthlyBarData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: "#9CA3AF", font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { precision: 0, color: "#9CA3AF", font: { size: 10 } },
                      grid: { color: "#F3F4F6" },
                    },
                  },
                }}
              />
            </div>
            {peakMonth && (
              <p className="mt-3 text-xs text-gray-400">
                <i className="ri-bar-chart-line mr-1 text-brand-500" />
                가장 많이 출원된 달: <span className="font-semibold text-gray-600">{peakMonth.month}</span> ({peakMonth.count}건)
              </p>
            )}
          </>
        ) : (
          <EmptyState title="월별 출원 데이터가 없습니다." />
        )}
      </div>

      {/* 등록 상태 현황 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">등록 상태 현황</h3>
          <p className="text-xs text-gray-400 mt-0.5">현재 특허들의 법적 상태를 나타냅니다</p>
        </div>

        {statusData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="relative h-52 flex items-center justify-center">
              <Doughnut
                data={statusChartData}
                options={{
                  plugins: { legend: { display: false } },
                  cutout: "72%",
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400">등록률</span>
                <span className="text-2xl font-bold text-gray-900">{registrationRate}%</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* 그룹 범례 */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />등록</span>
                <span className="inline-flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />공개/심사중</span>
                <span className="inline-flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />소멸/기타</span>
              </div>
              {statusData.map((s) => {
                const g = STATUS_GROUP(s.status);
                const color = g === "registered" ? "#22C55E" : g === "pending" ? "#3B82F6" : "#D1D5DB";
                return (
                  <div key={s.status} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm text-gray-700">{s.status || "정보 없음"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{s.count.toLocaleString()}건</span>
                      <span className="text-xs text-gray-400 w-10 text-right">{s.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="등록 상태 데이터가 없습니다." />
        )}
      </div>

      {/* 최근 출원 특허 TOP 3 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">최근 출원 특허 TOP 3</h3>
            <p className="text-xs text-gray-400 mt-0.5">가장 최근에 출원된 주요 특허입니다</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleViewPatents}>
            전체 보기
          </Button>
        </div>

        {data.recentPatents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.recentPatents.slice(0, 3).map((patent) => (
              <RecentPatentCard key={patent.applicationNumber} patent={patent} />
            ))}
          </div>
        ) : (
          <EmptyState title="최근 특허 데이터가 없습니다." />
        )}
      </div>
    </div>
  );
}
