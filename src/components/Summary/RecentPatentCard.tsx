import { getStatusColor } from "../../utils/statusColor";

export interface RecentPatent {
  applicationNumber: string;
  inventionTitle: string;
  applicantName: string;
  applicationDate: string;
  ipcCode: string;
  registerStatus: string;
  isFavorite: boolean;
}

export default function RecentPatentCard({ patent }: { patent: RecentPatent }) {
  return (
    <div
      className="
        w-full
        bg-white border border-gray-200
        rounded-lg
        p-3 sm:p-4
        hover:shadow-md
        transition-shadow duration-200
      "
    >
      {/* 제목 + 상태 */}
      <div className="flex items-start justify-between gap-2 mb-2.5 sm:mb-3">
        <h4
          className="
            flex-1
            text-xs sm:text-sm
            font-semibold text-gray-900
            leading-snug
            line-clamp-2
          "
        >
          {patent.inventionTitle}
        </h4>
        <span
          className={`
            px-1.5 sm:px-2
            py-0.5 sm:py-1
            rounded-full
            text-[9px] sm:text-xs
            font-medium
            whitespace-nowrap
            ${getStatusColor(patent.registerStatus)}
          `}
        >
          {patent.registerStatus}
        </span>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <i className="ri-building-line w-3 h-3 flex items-center justify-center" />
          <span className="truncate">{patent.applicantName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <i className="ri-calendar-line w-3 h-3 flex items-center justify-center" />
          <span>{patent.applicationDate}</span>
        </div>

        {patent.ipcCode && (
          <div className="flex items-center gap-1.5">
            <i className="ri-code-line w-3 h-3 flex items-center justify-center" />
            <span className="truncate">{patent.ipcCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}
