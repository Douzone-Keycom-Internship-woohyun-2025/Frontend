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

  // Collect all unique IPC codes across all companies
  const topIpcCodes = useMemo(() => {
    const ipcMap = new Map<string, number>();
    companies.forEach((c) =>
      c.ipcDistribution.forEach((ipc) =>
        ipcMap.set(ipc.ipcCode, (ipcMap.get(ipc.ipcCode) ?? 0) + ipc.count)
      )
    );
    return Array.from(ipcMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([code]) => code);
  }, [companies]);

  // IPC comparison - Radar chart
  const ipcRadarData = useMemo(() => ({
    labels: topIpcCodes,
    datasets: companies.map((company, i) => {
      const color = COMPANY_COLORS[i % COMPANY_COLORS.length];
      const countMap = new Map(company.ipcDistribution.map((ipc) => [ipc.ipcCode, ipc.count]));
      return {
        label: company.applicant,
        data: topIpcCodes.map((code) => countMap.get(code) ?? 0),
        backgroundColor: color.light,
        borderColor: color.bg,
        borderWidth: 2,
        pointBackgroundColor: color.bg,
      };
    }),
  }), [companies, topIpcCodes]);

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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 부분 실패 경고 */}
      {data.failed && data.failed.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <i className="ri-error-warning-line text-orange-500 text-lg mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              일부 회사의 분석에 실패했습니다
            </p>
            <ul className="mt-1 text-sm text-orange-700">
              {data.failed.map((f) => (
                <li key={f.applicant}>{f.applicant}: {f.reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Header with export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {companies.map((c, i) => (
            <span
              key={c.applicant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: COMPANY_COLORS[i % COMPANY_COLORS.length].light,
                color: COMPANY_COLORS[i % COMPANY_COLORS.length].bg,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COMPANY_COLORS[i % COMPANY_COLORS.length].bg }}
              />
              {c.applicant}
            </span>
          ))}
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i className="ri-download-2-line" />
          CSV 내보내기
        </button>
      </div>

      {/* Stats comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: "총 특허 건수", key: "totalPatents" as const, icon: "ri-file-text-line", iconBg: "bg-brand-100", iconColor: "text-brand-700", suffix: "건" },
          { label: "등록률", key: "registrationRate" as const, icon: "ri-check-line", iconBg: "bg-green-100", iconColor: "text-green-600", suffix: "%" },
          { label: "월평균 출원", key: "monthlyAverage" as const, icon: "ri-calendar-line", iconBg: "bg-orange-100", iconColor: "text-orange-500", suffix: "건" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} ${stat.iconColor} text-lg`} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
            </div>
            <div className="space-y-2.5">
              {companies.map((company, i) => {
                const value = company.statistics[stat.key];
                const maxValue = Math.max(...companies.map((c) => c.statistics[stat.key]));
                const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                  <div key={company.applicant}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium truncate max-w-[60%]">
                        {company.applicant}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {stat.key === "registrationRate"
                          ? `${value}${stat.suffix}`
                          : `${typeof value === "number" ? value.toLocaleString() : value}${stat.suffix}`}
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
        ))}
      </div>

      {/* Monthly trend comparison - Line chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          월별 출원 동향 비교
        </h3>
        {allMonths.length > 0 ? (
          <div className="h-72 sm:h-80 relative">
            <Line
              data={monthlyLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#4B5563", font: { size: 10 } },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0, color: "#4B5563", font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">월별 데이터가 없습니다.</p>
        )}
      </div>

      {/* IPC radar + Status bar charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* IPC Radar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            기술 분야 비교 (IPC)
          </h3>
          {topIpcCodes.length > 0 ? (
            <div className="h-72 sm:h-80 relative flex items-center justify-center">
              <Radar
                data={ipcRadarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    r: {
                      beginAtZero: true,
                      ticks: { precision: 0, font: { size: 9 } },
                      pointLabels: { font: { size: 10 } },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">IPC 데이터가 없습니다.</p>
          )}
        </div>

        {/* Status grouped bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            등록 상태 비교
          </h3>
          {allStatuses.length > 0 ? (
            <div className="h-72 sm:h-80 relative">
              <Bar
                data={statusBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: "#4B5563", font: { size: 10 } },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { precision: 0, color: "#4B5563", font: { size: 10 } },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">상태 데이터가 없습니다.</p>
          )}
        </div>
      </div>

      {/* Comparison summary table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          비교 요약
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">항목</th>
                {companies.map((c, i) => (
                  <th key={c.applicant} className="text-right py-3 px-4 font-semibold" style={{ color: COMPANY_COLORS[i % COMPANY_COLORS.length].bg }}>
                    {c.applicant}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 text-gray-600">총 특허 건수</td>
                {companies.map((c) => (
                  <td key={c.applicant} className="py-3 px-4 text-right font-medium text-gray-900">
                    {c.statistics.totalPatents.toLocaleString()}건
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">등록률</td>
                {companies.map((c) => (
                  <td key={c.applicant} className="py-3 px-4 text-right font-medium text-gray-900">
                    {c.statistics.registrationRate}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">월평균 출원</td>
                {companies.map((c) => (
                  <td key={c.applicant} className="py-3 px-4 text-right font-medium text-gray-900">
                    {c.statistics.monthlyAverage}건
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">주력 기술분야</td>
                {companies.map((c) => (
                  <td key={c.applicant} className="py-3 px-4 text-right font-medium text-gray-900">
                    {c.ipcDistribution[0]?.ipcCode ?? "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">IPC 다양성</td>
                {companies.map((c) => (
                  <td key={c.applicant} className="py-3 px-4 text-right font-medium text-gray-900">
                    {c.ipcDistribution.length}개 분야
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
