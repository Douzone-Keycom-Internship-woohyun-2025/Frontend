import type { SummaryData } from "../../types/summary";
import { useNavigate } from "react-router-dom";
import RecentPatentCard from "./RecentPatentCard";
import NoData from "../common/NoData";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const renderSection = (
  condition: boolean,
  content: React.ReactNode,
  message: string
) => (condition ? content : <NoData message={message} />);

interface SummaryDashboardProps {
  data: SummaryData;
  presetFilters?: { applicant?: string; startDate?: string; endDate?: string };
}

export default function SummaryDashboard({
  data,
  presetFilters,
}: SummaryDashboardProps) {
  const navigate = useNavigate();

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

  // 데이터 정제
  const totalPatents = data?.statistics?.totalPatents || 0;
  const ipcData = data?.ipcDistribution || [];
  const monthlyData = data?.monthlyTrend || [];
  const statusData = data?.statusDistribution || [];
  const registrationRate = data?.statistics?.registrationRate ?? 0;

  const topIpcCodes = [...ipcData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentMonths = monthlyData.slice(-6);

  // IPC 파이 차트
  const ipcChartData = {
    labels: topIpcCodes.map((item) => item.ipcCode),
    datasets: [
      {
        data: topIpcCodes.map((item) => item.count),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 월별 색상
  const monthColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#14B8A6",
    "#A855F7",
    "#F97316",
    "#6366F1",
    "#EAB308",
  ];

  const monthlyBarColors = recentMonths.map(
    (_, i) => monthColors[i % monthColors.length]
  );

  const monthlyChartData = {
    labels: recentMonths.map((m) => m.month),
    datasets: [
      {
        label: "출원 건수",
        data: recentMonths.map((m) => m.count),
        backgroundColor: monthlyBarColors,
        hoverBackgroundColor: monthlyBarColors,
        borderRadius: 6,
      },
    ],
  };

  // 🔥 등록 상태 도넛 (statusLabel 없이 한글 그대로)
  const statusChartData = {
    labels: statusData.map((s) => s.status || "정보 없음"),
    datasets: [
      {
        data: statusData.map((s) => s.count),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#6B7280",
          "#8B5CF6",
        ],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  // 상단 통계 카드
  const statCards = [
    {
      label: "총 특허 건수",
      value: totalPatents.toLocaleString(),
      icon: "ri-file-text-line",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "등록률",
      value: `${registrationRate}%`,
      icon: "ri-check-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "월평균 출원",
      value: data.statistics.monthlyAverage,
      icon: "ri-calendar-line",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8">
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

      {/* IPC 분포 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
          상위 5개 IPC 코드별 기술분야 분포
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          특허 출원 상위 IPC 코드를 기준으로 비율을 표시합니다.
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

            <div className="flex flex-col justify-center space-y-2.5 sm:space-y-3">
              {topIpcCodes.map((item, index) => (
                <div
                  key={item.ipcCode}
                  className="flex justify-between bg-gray-50 px-3 sm:px-4 py-2 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: ipcChartData.datasets[0]
                          .backgroundColor[index] as string,
                      }}
                    />
                    <span className="text-xs sm:text-sm text-gray-800 font-medium">
                      {item.ipcCode}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {item.count}건 (
                    {totalPatents
                      ? ((item.count / totalPatents) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>,
          "IPC 코드 데이터가 없습니다."
        )}
      </div>

      {/* 월별 동향 & 상태 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 월별 동향 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            월별 특허 출원 동향
          </h3>

          {renderSection(
            monthlyData.length > 0,
            <div className="h-56 sm:h-72 relative">
              <Bar
                data={monthlyChartData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                  interaction: { mode: "nearest", intersect: false },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: "#4B5563", font: { size: 10 } },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        color: "#4B5563",
                        font: { size: 10 },
                      },
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

              {/* 중앙 퍼센트 */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] sm:text-xs text-gray-500 leading-none">
                  등록률
                </span>
                <span className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900 leading-none">
                  {registrationRate}%
                </span>
              </div>
            </div>,
            "등록 상태 데이터가 없습니다."
          )}
        </div>
      </div>

      {/* 최근 특허 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            최근 주요 특허
          </h3>
          <button
            onClick={handleViewPatents}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            검색된 특허 보기
          </button>
        </div>

        {renderSection(
          data.recentPatents.length > 0,
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {data.recentPatents.slice(0, 3).map((patent, index) => (
              <RecentPatentCard key={index} patent={patent} />
            ))}
          </div>,
          "최근 특허 데이터가 없습니다."
        )}
      </div>
    </div>
  );
}
