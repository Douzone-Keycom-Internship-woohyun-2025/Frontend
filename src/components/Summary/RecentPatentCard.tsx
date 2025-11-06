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
}
