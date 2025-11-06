import type { SummaryData } from "../../types/summary";
import { useNavigate } from "react-router-dom";
import { statusLabel } from "../../utils/statusLabel";
import RecentPatentCard from "./RecentPatentCard";
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

export default function SummaryDashboard({
  data,
  presetFilters,
}: {
  data: SummaryData;
  presetFilters?: { applicant?: string; startDate?: string; endDate?: string };
}) {
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

  const getIpcTechName = (ipcCode: string): string => {
    const ipcTechMap: Record<string, string> = {
      "G06F 3": "입력 장치",
      "H04L 29": "네트워크 프로토콜",
      "G06Q 50": "비즈니스 시스템",
      "H04W 4": "무선 통신",
      "G06F 21": "보안 시스템",
      "G06N 3": "인공지능",
      "H04N 21": "멀티미디어",
      "G06F 9": "프로그램 제어",
      A61M: "치료 기기",
      "G06F 15": "디지털 컴퓨터",
      H04M: "전화 통신",
      "G06F 17": "디지털 컴퓨팅",
    };
    return ipcTechMap[ipcCode] || "기타 기술";
  };

  const topIpcCodes = [...data.ipcDistribution]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const recentMonths = data.monthlyTrend.slice(-6);

  // Chart.js 데이터셋 구성
  const ipcChartData = {
    labels: topIpcCodes.map(
      (item) => `${item.ipcCode} (${getIpcTechName(item.ipcCode)})`
    ),
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

  const monthlyChartData = {
    labels: recentMonths.map((m) => m.month),
    datasets: [
      {
        label: "출원 건수",
        data: recentMonths.map((m) => m.count),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const statusChartData = {
    labels: data.statusDistribution.map(
      (s) => statusLabel[s.status as keyof typeof statusLabel] || s.status
    ),
    datasets: [
      {
        data: data.statusDistribution.map((s) => s.count),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#6B7280",
          "#8B5CF6",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">총 특허 건수</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.statistics.totalPatents.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-text-line text-blue-600 text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">등록률</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.statistics.registrationRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-green-600 text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">월평균 출원</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.statistics.monthlyAverage}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line text-orange-600 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* IPC 코드별 기술분야 분포 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          IPC 코드별 기술분야 분포
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 flex justify-center items-center">
            <Pie
              data={ipcChartData}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { enabled: true },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="flex flex-col justify-center space-y-3">
            {topIpcCodes.map((item, index) => (
              <div
                key={item.ipcCode}
                className="flex justify-between bg-gray-50 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ipcChartData.datasets[0].backgroundColor[
                        index
                      ] as string,
                    }}
                  />
                  <span className="text-gray-800 font-medium">
                    {item.ipcCode}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">
                  {item.count}건 (
                  {((item.count / data.statistics.totalPatents) * 100).toFixed(
                    1
                  )}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월별 출원 동향 + 상태별 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월별 특허 출원 동향 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            월별 특허 출원 동향
          </h3>
          <div className="h-72">
            <Bar
              data={monthlyChartData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#4B5563" },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0, color: "#4B5563" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* 등록 상태별 분포 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            등록 상태별 분포
          </h3>
          <div className="h-72 flex justify-center items-center">
            <Doughnut
              data={statusChartData}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { enabled: true },
                },
                cutout: "70%",
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* 최근 주요 특허 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            최근 주요 특허
          </h3>
          <button
            onClick={handleViewPatents}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            검색된 특허 보기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recentPatents.slice(0, 3).map((patent, index) => (
            <RecentPatentCard key={index} patent={patent} />
          ))}
        </div>
      </div>
    </div>
  );
}
