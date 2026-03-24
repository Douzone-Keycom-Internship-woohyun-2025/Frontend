import { useMemo } from "react";
import type { ComparisonResponse } from "@/types/comparison";
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
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Radar } from "react-chartjs-2";
import { downloadCsv } from "@/utils/exportCsv";

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
  Filler,
  RadialLinearScale
);

// Radar is imported but not used in this version — kept for import compliance
void Radar;

const COMPANY_COLORS = [
  { bg: "#003675", light: "rgba(0, 54, 117, 0.15)", border: "#003675" },
  { bg: "#059669", light: "rgba(5, 150, 105, 0.15)", border: "#059669" },
  { bg: "#F97316", light: "rgba(249, 115, 22, 0.15)", border: "#F97316" },
  { bg: "#DC2626", light: "rgba(220, 38, 38, 0.15)", border: "#DC2626" },
  { bg: "#7C3AED", light: "rgba(124, 58, 237, 0.15)", border: "#7C3AED" },
];

interface ComparisonDashboardProps {
  data: ComparisonResponse;
}

export default function ComparisonDashboard({ data }: ComparisonDashboardProps) {
  const companies = data.companies;

  // Collect all unique months across all companies, sorted
  const allMonths = useMemo(() => {
    const monthSet = new Set<string>();
    companies.forEach((c) => c.monthlyTrend.forEach((m) => monthSet.add(m.month)));
    return Array.from(monthSet).sort();
  }, [companies]);

  // Monthly trend - Line chart data
  const monthlyLineData = useMemo(() => ({
    labels: allMonths,
    datasets: companies.map((company, i) => {
      const color = COMPANY_COLORS[i % COMPANY_COLORS.length];
      const countMap = new Map(company.monthlyTrend.map((m) => [m.month, m.count]));
      return {
        label: company.applicant,
        data: allMonths.map((month) => countMap.get(month) ?? 0),
        borderColor: color.bg,
        backgroundColor: color.light,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
    }),
  }), [companies, allMonths]);

  // Status comparison - Grouped bar chart
  const allStatuses = useMemo(() => {
    const statusSet = new Set<string>();
    companies.forEach((c) => c.statusDistribution.forEach((s) => statusSet.add(s.status)));
    return Array.from(statusSet);
  }, [companies]);

  const statusBarData = useMemo(() => ({
    labels: allStatuses,
    datasets: companies.map((company, i) => {
      const color = COMPANY_COLORS[i % COMPANY_COLORS.length];
      const countMap = new Map(company.statusDistribution.map((s) => [s.status, s.count]));
      return {
        label: company.applicant,
        data: allStatuses.map((status) => countMap.get(status) ?? 0),
        backgroundColor: color.bg,
        borderRadius: 4,
      };
    }),
  }), [companies, allStatuses]);

  // Top IPC areas across all companies (by total count), with Korean names
  const topIpcAreas = useMemo(() => {
    const ipcMap = new Map<string, { ipcCode: string; ipcKorName: string; total: number; perCompany: number[] }>();
    companies.forEach((c, ci) => {
      c.ipcDistribution.forEach((ipc) => {
        if (!ipcMap.has(ipc.ipcCode)) {
          ipcMap.set(ipc.ipcCode, {
            ipcCode: ipc.ipcCode,
            ipcKorName: ipc.ipcKorName || ipc.ipcCode,
            total: 0,
            perCompany: companies.map(() => 0),
          });
        }
        const entry = ipcMap.get(ipc.ipcCode)!;
        entry.total += ipc.count;
        entry.perCompany[ci] = ipc.count;
      });
    });
    return Array.from(ipcMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [companies]);

  const handleExportCsv = () => {
    const headers = ["출원인", "총 특허", "등록률(%)", "월평균 출원", "상위 IPC"];
    const rows = companies.map((c) => [
      c.applicant,
      String(c.statistics.totalPatents),
      String(c.statistics.registrationRate),
      String(c.statistics.monthlyAverage),
      c.ipcDistribution.slice(0, 3).map((i) => i.ipcCode).join(", "),
    ]);
    downloadCsv("경쟁사비교", headers, rows);
  };

  // Insight narrative
  const insightText = useMemo(() => {
    if (companies.length === 0) return "";

    const patentLeader = [...companies].sort((a, b) => b.statistics.totalPatents - a.statistics.totalPatents)[0];
    const rateLeader = [...companies].sort((a, b) => b.statistics.registrationRate - a.statistics.registrationRate)[0];

    // Check if top IPC area is shared
    const topIpcPerCompany = companies.map((c) =>
      [...c.ipcDistribution].sort((a, b) => b.count - a.count)[0]?.ipcKorName
    );
    const sharedTopIpc = topIpcPerCompany.every((name) => name && name === topIpcPerCompany[0])
      ? topIpcPerCompany[0]
      : null;

    let text = `${patentLeader.applicant}이(가) ${patentLeader.statistics.totalPatents.toLocaleString()}건으로 가장 많은 특허를 출원했습니다.`;
    if (rateLeader.applicant !== patentLeader.applicant) {
      text += ` 등록률은 ${rateLeader.applicant}이(가) ${rateLeader.statistics.registrationRate}%로 가장 높습니다.`;
    } else {
      text += ` 등록률도 ${rateLeader.statistics.registrationRate}%로 가장 높습니다.`;
    }
    if (sharedTopIpc) {
      text += ` 모든 출원인이 ${sharedTopIpc} 분야에 집중하고 있습니다.`;
    } else if (topIpcAreas[0]) {
      text += ` 전체 비교 대상 중 ${topIpcAreas[0].ipcKorName} 분야 특허가 가장 많습니다.`;
    }

    return text;
  }, [companies, topIpcAreas]);

  return (
    <div className="space-y-6">
      {/* 부분 실패 경고 */}
      {data.failed && data.failed.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <i className="ri-error-warning-line text-orange-500 text-lg mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">일부 회사의 분석에 실패했습니다</p>
            <ul className="mt-1 text-sm text-orange-700">
              {data.failed.map((f) => (
                <li key={f.applicant}>{f.applicant}: {f.reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 인사이트 요약 바 */}
      <div className="flex items-start justify-between gap-4 bg-brand-50 border border-brand-100 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center shrink-0">
            <i className="ri-lightbulb-line text-white text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-brand-900 leading-relaxed">{insightText}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {companies.map((c, i) => (
                <span
                  key={c.applicant}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: COMPANY_COLORS[i % COMPANY_COLORS.length].light,
                    color: COMPANY_COLORS[i % COMPANY_COLORS.length].bg,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COMPANY_COLORS[i % COMPANY_COLORS.length].bg }}
                  />
                  {c.applicant}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleExportCsv}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
        >
          <i className="ri-download-2-line" />
          <span className="hidden sm:inline">CSV</span>
        </button>
      </div>

      {/* 지표 카드 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "총 특허 건수",
            key: "totalPatents" as const,
            icon: "ri-file-text-line",
            iconBg: "bg-brand-50",
            iconColor: "text-brand-700",
            suffix: "건",
            desc: "검색 기간 내 출원된 전체 특허 수",
          },
          {
            label: "등록률",
            key: "registrationRate" as const,
            icon: "ri-shield-check-line",
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
            suffix: "%",
            desc: "출원 대비 실제 등록된 비율 — 높을수록 기술 경쟁력 강함",
          },
          {
            label: "월평균 출원",
            key: "monthlyAverage" as const,
            icon: "ri-calendar-line",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500",
            suffix: "건",
            desc: "한 달 평균 출원 건수",
          },
        ].map((stat) => {
          const maxValue = Math.max(...companies.map((c) => c.statistics[stat.key]));
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} ${stat.iconColor} text-base`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{stat.label}</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">{stat.desc}</p>
              <div className="space-y-3">
                {companies.map((company, i) => {
                  const value = company.statistics[stat.key];
                  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const isWinner = value === maxValue;
                  return (
                    <div key={company.applicant}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-1 text-gray-700 font-medium truncate max-w-[60%]">
                          {isWinner && (
                            <i
                              className="ri-vip-crown-line text-xs"
                              style={{ color: COMPANY_COLORS[i % COMPANY_COLORS.length].bg }}
                            />
                          )}
                          {company.applicant}
                        </span>
                        <span className="font-semibold text-gray-900 shrink-0">
                          {typeof value === "number" ? value.toLocaleString() : value}{stat.suffix}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: COMPANY_COLORS[i % COMPANY_COLORS.length].bg,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 월별 출원 동향 비교 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">월별 출원 동향 비교</h3>
          <p className="text-xs text-gray-400 mt-0.5">각 출원인의 월별 특허 출원 건수 추이를 비교합니다</p>
        </div>
        {allMonths.length > 0 ? (
          <div className="h-64 relative">
            <Line
              data={monthlyLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { position: "bottom", labels: { font: { size: 11 }, padding: 16 } },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#9CA3AF", font: { size: 10 }, maxRotation: 45 },
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
        ) : (
          <p className="text-gray-400 text-center py-8 text-sm">월별 데이터가 없습니다.</p>
        )}
      </div>

      {/* 기술 분야 비교 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">기술 분야 비교</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            주요 기술 분야별 출원 건수를 비교합니다
            <span className="text-gray-300"> — IPC는 특허 기술 분류 코드입니다</span>
          </p>
        </div>

        {topIpcAreas.length > 0 ? (
          <div className="space-y-4">
            {topIpcAreas.map((area) => {
              const maxPerCompany = Math.max(...area.perCompany);
              return (
                <div key={area.ipcCode} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate block">
                        {area.ipcKorName}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{area.ipcCode}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">합계 {area.total}건</span>
                  </div>
                  <div className="space-y-1.5">
                    {companies.map((company, i) => {
                      const count = area.perCompany[i];
                      const pct = maxPerCompany > 0 ? (count / maxPerCompany) * 100 : 0;
                      return (
                        <div key={company.applicant} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-20 shrink-0 truncate">{company.applicant}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: COMPANY_COLORS[i % COMPANY_COLORS.length].bg,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-8 text-right shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8 text-sm">기술 분야 데이터가 없습니다.</p>
        )}
      </div>

      {/* 등록 상태 비교 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">등록 상태 비교</h3>
          <p className="text-xs text-gray-400 mt-0.5">각 출원인의 특허 법적 상태를 비교합니다</p>
        </div>
        {allStatuses.length > 0 ? (
          <div className="h-64 relative">
            <Bar
              data={statusBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom", labels: { font: { size: 11 }, padding: 16 } },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#9CA3AF", font: { size: 10 } },
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
        ) : (
          <p className="text-gray-400 text-center py-8 text-sm">상태 데이터가 없습니다.</p>
        )}
      </div>

      {/* 비교 요약 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">비교 요약</h3>
          <p className="text-xs text-gray-400 mt-0.5">주요 지표 한눈에 비교</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">항목</th>
                {companies.map((c, i) => (
                  <th
                    key={c.applicant}
                    className="text-right py-3 px-4 font-semibold text-sm"
                    style={{ color: COMPANY_COLORS[i % COMPANY_COLORS.length].bg }}
                  >
                    {c.applicant}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                {
                  label: "총 특허 건수",
                  render: (c: typeof companies[0]) => `${c.statistics.totalPatents.toLocaleString()}건`,
                  getValue: (c: typeof companies[0]) => c.statistics.totalPatents,
                },
                {
                  label: "등록률",
                  render: (c: typeof companies[0]) => `${c.statistics.registrationRate}%`,
                  getValue: (c: typeof companies[0]) => c.statistics.registrationRate,
                },
                {
                  label: "월평균 출원",
                  render: (c: typeof companies[0]) => `${c.statistics.monthlyAverage}건`,
                  getValue: (c: typeof companies[0]) => c.statistics.monthlyAverage,
                },
                {
                  label: "주력 기술분야",
                  render: (c: typeof companies[0]) => c.ipcDistribution[0]?.ipcKorName ?? "-",
                  getValue: null,
                },
                {
                  label: "기술 다양성",
                  render: (c: typeof companies[0]) => `${c.ipcDistribution.length}개 분야`,
                  getValue: (c: typeof companies[0]) => c.ipcDistribution.length,
                },
              ].map((row) => {
                const maxVal = row.getValue
                  ? Math.max(...companies.map(row.getValue))
                  : null;
                return (
                  <tr key={row.label} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{row.label}</td>
                    {companies.map((c, i) => {
                      const isWinner = row.getValue && maxVal !== null && row.getValue(c) === maxVal;
                      return (
                        <td key={c.applicant} className="py-3 px-4 text-right">
                          <span
                            className={`font-medium ${isWinner ? "font-semibold" : "text-gray-700"}`}
                            style={isWinner ? { color: COMPANY_COLORS[i % COMPANY_COLORS.length].bg } : undefined}
                          >
                            {row.render(c)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
