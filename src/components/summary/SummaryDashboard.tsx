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
import { Chart, Doughnut } from "react-chartjs-2";

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

function ipcDisplayName(name: string | undefined, code: string): string {
  if (!name || name === "알 수 없음") return code;
  return name;
}

const IPC_COLORS = [
  "#003675", "#059669", "#F97316", "#DC2626", "#7C3AED",
  "#0891B2", "#CA8A04", "#BE185D", "#4F46E5", "#16A34A",
];

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

  const peakMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return monthlyData.reduce((max, m) => (m.count > max.count ? m : max), monthlyData[0]);
  }, [monthlyData]);

  const peakMonthIndex = useMemo(
    () => monthlyData.findIndex((m) => m.month === peakMonth?.month),
    [monthlyData, peakMonth]
  );

  // 활성 특허 수 (등록 상태)
  const activePatentCount = useMemo(() => {
    const reg = statusData.find((s) => s.status === "등록");
    return reg?.count ?? 0;
  }, [statusData]);

  // 기술 집중도 (상위 1개 IPC 비율)
  const techConcentration = useMemo(() => {
    if (sortedIpc.length === 0) return null;
    return sortedIpc[0].percentage;
  }, [sortedIpc]);

  // 인텔리전스 신호 계산
  const signals = useMemo(() => {
    const items: Array<{
      type: "positive" | "negative" | "warning" | "neutral" | "info";
      icon: string;
      label: string;
      value: string;
      desc: string;
    }> = [];

    if (growthRate !== null) {
      items.push({
        type: growthRate >= 10 ? "positive" : growthRate <= -10 ? "negative" : "neutral",
        icon: growthRate >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line",
        label: "출원 트렌드",
        value: `${growthRate >= 0 ? "+" : ""}${growthRate}%`,
        desc: "최근 3개월 대비",
      });
    }

    if (techConcentration !== null) {
      items.push({
        type: techConcentration > 60 ? "warning" : "info",
        icon: "ri-focus-3-line",
        label: "기술 집중도",
        value: `${techConcentration}%`,
        desc: techConcentration > 60
          ? `${sortedIpc[0] ? ipcDisplayName(sortedIpc[0].ipcName, sortedIpc[0].ipcCode) : ""} 편중`
          : `${sortedIpc.length}개 분야 분산`,
      });
    }

    items.push({
      type: registrationRate >= 60 ? "positive" : registrationRate >= 35 ? "neutral" : "negative",
      icon: "ri-shield-check-line",
      label: "등록 효율",
      value: `${registrationRate}%`,
      desc: registrationRate >= 60
        ? "높은 기술 경쟁력"
        : registrationRate >= 35
        ? "평균 수준"
        : "낮은 등록률",
    });

    if (peakMonth && data.statistics.monthlyAverage > 0) {
      const peakRatio = peakMonth.count / data.statistics.monthlyAverage;
      if (peakRatio > 1.5) {
        items.push({
          type: "info",
          icon: "ri-calendar-event-line",
          label: "피크 출원월",
          value: peakMonth.month,
          desc: `평균의 ${peakRatio.toFixed(1)}배`,
        });
      }
    }

    return items;
  }, [growthRate, techConcentration, registrationRate, peakMonth, sortedIpc, data]);

  // 인사이트 자연어 해석 (복수 문장)
  const interpretations = useMemo(() => {
    const lines: Array<{ icon: string; color: string; text: string }> = [];
    const applicant = presetFilters?.applicant || "해당 출원인";
    const topField = sortedIpc[0] ? ipcDisplayName(sortedIpc[0].ipcName, sortedIpc[0].ipcCode) : undefined;

    lines.push({
      icon: "ri-file-text-line",
      color: "text-brand-700",
      text: `${applicant}은(는) 검색 기간 내 총 ${totalPatents.toLocaleString()}건을 출원했으며 등록률은 ${registrationRate}%입니다.`,
    });

    if (growthRate !== null) {
      const isUp = growthRate >= 0;
      lines.push({
        icon: isUp ? "ri-arrow-up-circle-line" : "ri-arrow-down-circle-line",
        color: isUp ? "text-green-600" : "text-red-500",
        text: isUp
          ? `최근 3개월 출원이 이전 대비 ${growthRate}% 증가 — R&D 투자가 확대되고 있습니다.`
          : `최근 3개월 출원이 이전 대비 ${Math.abs(growthRate)}% 감소 — 출원 활동이 둔화되고 있습니다.`,
      });
    }

    if (topField && techConcentration !== null) {
      lines.push({
        icon: "ri-focus-3-line",
        color: techConcentration > 60 ? "text-orange-500" : "text-brand-600",
        text: techConcentration > 60
          ? `${topField} 분야에 ${techConcentration}%가 집중된 특화 포트폴리오입니다.`
          : `${topField} 외 ${sortedIpc.length}개 기술 분야로 분산된 포트폴리오입니다.`,
      });
    }

    if (activePatentCount > 0) {
      const activeRate = Math.round((activePatentCount / totalPatents) * 100);
      lines.push({
        icon: "ri-award-line",
        color: "text-purple-600",
        text: `현재 활성 등록 특허 ${activePatentCount.toLocaleString()}건(${activeRate}%)이 지식재산 자산으로 유지되고 있습니다.`,
      });
    }

    return lines;
  }, [presetFilters, totalPatents, registrationRate, sortedIpc, growthRate, techConcentration, activePatentCount]);

  // 월별 혼합 차트 (바 + 누적 라인)
  const monthlyChartData = useMemo(() => ({
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        type: "bar" as const,
        label: "월별 출원",
        data: monthlyData.map((m) => m.count),
        backgroundColor: monthlyData.map((_, i) =>
          i === peakMonthIndex ? "#6da0f5" : "#003675"
        ),
        borderRadius: 4,
        yAxisID: "y",
        order: 2,
      },
      {
        type: "line" as const,
        label: "누적 출원",
        data: monthlyData.map((m) => m.cumulativeCount),
        borderColor: "#F97316",
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        yAxisID: "y2",
        order: 1,
      },
    ],
  }), [monthlyData, peakMonthIndex]);

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
      ["활성 특허", String(activePatentCount)],
      [],
      ["--- IPC 분포 ---", ""],
      ...sortedIpc.map((ipc) => [
        `${ipc.ipcCode} (${ipcDisplayName(ipc.ipcName, ipc.ipcCode)})`,
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
      unit: "건",
      desc: "검색 기간 내 전체 출원",
      icon: "ri-file-text-line",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-700",
      badge: null as React.ReactNode,
    },
    {
      label: "등록률",
      value: `${registrationRate}`,
      unit: "%",
      desc: "출원 대비 등록 비율",
      icon: "ri-shield-check-line",
      iconBg: registrationRate >= 60 ? "bg-green-50" : "bg-orange-50",
      iconColor: registrationRate >= 60 ? "text-green-600" : "text-orange-500",
      badge: (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
          registrationRate >= 60 ? "bg-green-100 text-green-700" :
          registrationRate >= 35 ? "bg-orange-100 text-orange-600" :
          "bg-red-100 text-red-600"
        }`}>
          {registrationRate >= 60 ? "우수" : registrationRate >= 35 ? "보통" : "저조"}
        </span>
      ),
    },
    {
      label: "월평균 출원",
      value: String(data.statistics.monthlyAverage),
      unit: "건/월",
      desc: "기간 내 월평균",
      icon: "ri-calendar-line",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      badge:
        growthRate !== null ? (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            growthRate >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            <i className={growthRate >= 0 ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
            {Math.abs(growthRate)}%
          </span>
        ) : null,
    },
    {
      label: "활성 등록 특허",
      value: activePatentCount.toLocaleString(),
      unit: "건",
      desc: "현재 등록 유지 중",
      icon: "ri-award-line",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      badge: totalPatents > 0 ? (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600">
          {Math.round((activePatentCount / totalPatents) * 100)}%
        </span>
      ) : null,
    },
    {
      label: "기술 분야 수",
      value: String(sortedIpc.length),
      unit: "개",
      desc: sortedIpc.length > 0 ? `주력: ${ipcDisplayName(sortedIpc[0]?.ipcName, sortedIpc[0]?.ipcCode ?? "")}` : "IPC 분류 없음",
      icon: "ri-focus-3-line",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: techConcentration !== null ? (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
          techConcentration > 60 ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
        }`}>
          집중 {techConcentration}%
        </span>
      ) : null,
    },
  ];

  return (
    <div className="space-y-5">

      {/* 인텔리전스 해석 + 신호 */}
      <div className="bg-brand-900 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <i className="ri-lightbulb-flash-line text-sm text-brand-200" />
            </div>
            <span className="text-sm font-semibold text-brand-100">특허 인텔리전스</span>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
            <i className="ri-download-2-line" />
            <span className="hidden sm:inline">CSV 내보내기</span>
          </button>
        </div>

        {/* 신호 칩 */}
        {signals.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {signals.map((sig, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <i className={`${sig.icon} text-sm`} />
                <span className="text-xs font-medium">{sig.label}</span>
                <span className={`text-xs font-bold ${
                  sig.type === "positive" ? "text-green-300" :
                  sig.type === "negative" ? "text-red-300" :
                  sig.type === "warning" ? "text-orange-300" :
                  "text-brand-200"
                }`}>{sig.value}</span>
                <span className="text-[10px] text-white/50">{sig.desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* 해석 문장 */}
        <div className="space-y-2">
          {interpretations.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <i className={`${line.icon} text-sm mt-0.5 shrink-0 text-white/60`} />
              <p className="text-sm text-white/80 leading-relaxed">{line.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 지표 5개 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2.5">
              <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <i className={`${card.icon} ${card.iconColor} text-base`} />
              </div>
              {card.badge}
            </div>
            <p className="text-[11px] font-medium text-gray-500 mb-0.5">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 leading-none">
              {card.value}
              <span className="text-xs font-normal text-gray-400 ml-1">{card.unit}</span>
            </p>
            <p className="mt-1.5 text-[10px] text-gray-400 leading-relaxed truncate" title={card.desc}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* 월별 출원 동향 + IPC 분포 (lg: 2열) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* 월별 출원 동향 (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-base font-semibold text-gray-900">월별 출원 동향</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                막대: 월별 출원 &nbsp;·&nbsp;
                <span className="text-orange-400">—</span> 누적 추이
                {peakMonth && <span className="ml-2 text-brand-400">▮ 피크월 강조</span>}
              </p>
            </div>
            {peakMonth && (
              <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-400">최다 출원</p>
                <p className="text-sm font-bold text-brand-700">{peakMonth.month}</p>
                <p className="text-[10px] text-gray-500">{peakMonth.count}건</p>
              </div>
            )}
          </div>

          {monthlyData.length > 0 ? (
            <div className="h-48 sm:h-60 mt-4">
              <Chart
                type="bar"
                data={monthlyChartData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                      callbacks: {
                        label: (ctx) => {
                          const y = ctx.parsed.y ?? 0;
                          if (ctx.dataset.label === "누적 출원")
                            return ` 누적 ${y.toLocaleString()}건`;
                          return ` ${y}건`;
                        },
                      },
                    },
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
                      position: "left",
                      ticks: { precision: 0, color: "#9CA3AF", font: { size: 10 } },
                      grid: { color: "#F9FAFB" },
                    },
                    y2: {
                      beginAtZero: true,
                      position: "right",
                      ticks: { precision: 0, color: "#F97316", font: { size: 9 } },
                      grid: { display: false },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <EmptyState title="월별 출원 데이터가 없습니다." />
          )}
        </div>

        {/* 기술 분야 분포 (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-base font-semibold text-gray-900">기술 분야 분포</h3>
              <p className="text-xs text-gray-400 mt-0.5">IPC 분류 기준</p>
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
            <div className="mt-4 space-y-2.5">
              {displayedIpc.map((item, index) => (
                <div key={item.ipcCode} className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-gray-400 w-4 shrink-0">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: IPC_COLORS[index % IPC_COLORS.length] }} />
                        <span className="text-xs text-gray-800 font-medium truncate">
                          {ipcDisplayName(item.ipcName, item.ipcCode)}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono shrink-0">{item.ipcCode}</span>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0 ml-2 font-semibold">{item.percentage}%</span>
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
      </div>

      {/* 등록 상태 현황 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">등록 상태 현황</h3>
          <p className="text-xs text-gray-400 mt-0.5">특허들의 현재 법적 상태 분포</p>
        </div>

        {statusData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="relative h-44 sm:h-52 flex items-center justify-center">
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
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />등록</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />공개/심사중</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />소멸/기타</span>
              </div>
              {statusData.map((s) => {
                const g = STATUS_GROUP(s.status);
                const color = g === "registered" ? "#22C55E" : g === "pending" ? "#3B82F6" : "#D1D5DB";
                return (
                  <div key={s.status} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-700 flex-1">{s.status || "정보 없음"}</span>
                    <span className="text-sm font-semibold text-gray-900">{s.count.toLocaleString()}건</span>
                    <span className="text-xs text-gray-400 w-10 text-right">{s.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="등록 상태 데이터가 없습니다." />
        )}
      </div>

      {/* 최근 출원 특허 TOP 5 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">최근 출원 특허</h3>
            <p className="text-xs text-gray-400 mt-0.5">가장 최근 출원된 주요 특허 목록</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleViewPatents}>
            전체 보기
          </Button>
        </div>

        {data.recentPatents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.recentPatents.slice(0, 6).map((patent) => (
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
