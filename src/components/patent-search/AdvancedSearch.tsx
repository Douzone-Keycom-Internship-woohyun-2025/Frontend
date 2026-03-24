import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  advancedSearchSchema,
  type AdvancedSearchFormData,
} from "@/validators/searchSchemas";
import type { PatentStatus } from "@/types/patent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
          <Input
            type="text"
            placeholder="예: 배터리, 통신, AI"
            {...register("patentName")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            출원인 <span className="text-gray-400">(선택)</span>
          </label>
          <Input
            type="text"
            placeholder="예: 삼성전자, LG전자"
            {...register("companyName")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 날짜 <span className="text-gray-400">(선택)</span>
            </label>
            <Input
              type="date"
              {...register("startDate")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 날짜 <span className="text-gray-400">(선택)</span>
            </label>
            <Input
              type="date"
              {...register("endDate")}
              className={errors.endDate ? "border-red-500" : ""}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600"
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
        <Button type="submit" className="w-full sm:flex-1 h-11">
          검색
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          className="w-full sm:flex-1 h-11"
        >
          초기화
        </Button>
      </div>
    </form>
  );
}
