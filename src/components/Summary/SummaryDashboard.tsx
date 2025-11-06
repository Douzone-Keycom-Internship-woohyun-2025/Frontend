import type { SummaryData } from "../../types/summary";
import { getStatusColor } from "../../utils/statusColor";
import { useNavigate } from "react-router-dom";

type RecentPatent = {
  applicationNumber: string;
  inventionTitle: string;
  applicantName: string;
  applicationDate: string;
  ipcCode: string;
  registerStatus: string;
  isFavorite: boolean;
};

const RecentPatentCard = ({ patent }: { patent: RecentPatent }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">
          {patent.inventionTitle}
        </h4>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(
            patent.registerStatus
          )}`}
        >
          {patent.registerStatus}
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center">
          <i className="ri-building-line w-3 h-3 flex items-center justify-center mr-2"></i>
          <span>{patent.applicantName}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-calendar-line w-3 h-3 flex items-center justify-center mr-2"></i>
          <span>{patent.applicationDate}</span>
        </div>
        {patent.ipcCode && (
          <div className="flex items-center">
            <i className="ri-code-line w-3 h-3 flex items-center justify-center mr-2"></i>
            <span>{patent.ipcCode}</span>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const top5Total = topIpcCodes.reduce((sum, item) => sum + item.count, 0);

  const recentMonths = data.monthlyTrend.slice(-6);

  const statusColors: Record<string, string> = {
    등록: "#10B981",
    심사중: "#F59E0B",
    출원: "#3B82F6",
    거절: "#EF4444",
    포기: "#6B7280",
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full transform -rotate-90"
              >
                {topIpcCodes.map((item, index) => {
                  const percentage = (item.count / top5Total) * 100;
                  const angle = (percentage / 100) * 360;
                  const startAngle = topIpcCodes
                    .slice(0, index)
                    .reduce(
                      (sum, prev) => sum + (prev.count / top5Total) * 360,
                      0
                    );

                  const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 =
                    100 + 80 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                  const y2 =
                    100 + 80 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                  const largeArcFlag = angle > 180 ? 1 : 0;
                  const colors = [
                    "#3B82F6",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                  ];

                  return (
                    <path
                      key={item.ipcCode}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={colors[index]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {topIpcCodes.map((item, index) => {
              const percentage = ((item.count / top5Total) * 100).toFixed(1);
              const colors = [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
              ];

              return (
                <div
                  key={item.ipcCode}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.ipcCode}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getIpcTechName(item.ipcCode)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {item.count}건
                    </div>
                    <div className="text-sm text-gray-600">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 월별 특허 출원 동향 + 등록 상태별 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월별 특허 출원 동향 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            월별 특허 출원 동향
          </h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 space-x-2 mb-4">
              {recentMonths.map((item, index) => {
                const maxValue = Math.max(...recentMonths.map((m) => m.count));
                const height = (item.count / maxValue) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${item.month}: ${item.count}건`}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      {item.month}
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 등록 상태별 분포 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            등록 상태별 분포
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full transform -rotate-90"
              >
                {data.statusDistribution.map((item, index) => {
                  const total = data.statusDistribution.reduce(
                    (sum, s) => sum + s.count,
                    0
                  );
                  const percentage = (item.count / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const startAngle = data.statusDistribution
                    .slice(0, index)
                    .reduce((sum, s) => sum + (s.count / total) * 360, 0);

                  const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 =
                    100 + 80 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                  const y2 =
                    100 + 80 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  return (
                    <path
                      key={item.status}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={statusColors[item.status]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {data.statusDistribution.map((item) => {
              const total = data.statusDistribution.reduce(
                (sum, s) => sum + s.count,
                0
              );
              const percentage = ((item.count / total) * 100).toFixed(1);
              return (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusColors[item.status] }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.status}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {item.count}건
                    </span>
                    <span className="text-gray-600 ml-1">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
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
