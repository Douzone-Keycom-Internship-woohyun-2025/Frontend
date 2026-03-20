import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  advancedSearchSchema,
  type AdvancedSearchFormData,
} from "@/validators/searchSchemas";
import type { PatentStatus } from "@/types/patent";

interface AdvancedSearchProps {
  onSearch: (params: {
    patentName?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    status?: PatentStatus;
  }) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: PatentStatus[] = [
  "등록",
  "공개",
  "취하",
  "소멸",
  "포기",
  "무효",
  "거절",
];

export default function AdvancedSearch({
  onSearch,
  onReset,
}: AdvancedSearchProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdvancedSearchFormData>({
    resolver: zodResolver(advancedSearchSchema),
    defaultValues: {
      patentName: "",
      companyName: "",
      startDate: "",
      endDate: "",
      status: "",
    },
  });

  const onValid = (data: AdvancedSearchFormData) => {
    const params: {
      patentName?: string;
      companyName?: string;
      startDate?: string;
      endDate?: string;
      status?: PatentStatus;
    } = {};

    if (data.patentName?.trim()) params.patentName = data.patentName.trim();
    if (data.companyName?.trim()) params.companyName = data.companyName.trim();
    if (data.startDate) params.startDate = data.startDate;
    if (data.endDate) params.endDate = data.endDate;
    if (data.status) params.status = data.status as PatentStatus;

    onSearch(params);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            특허명 <span className="text-gray-400">(선택)</span>
          </label>
          <input
            type="text"
            placeholder="예: 배터리, 통신, AI"
            {...register("patentName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            출원인 <span className="text-gray-400">(선택)</span>
          </label>
          <input
            type="text"
            placeholder="예: 삼성전자, LG전자"
            {...register("companyName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 날짜 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 날짜 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              type="date"
              {...register("endDate")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상태 <span className="text-gray-400">(선택)</span>
          </label>

          <select
            {...register("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="submit"
          className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          검색
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          초기화
        </button>
      </div>
    </form>
  );
}
