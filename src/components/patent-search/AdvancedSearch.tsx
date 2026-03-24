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
  "등록", "공개", "취하", "소멸", "포기", "무효", "거절",
];

export default function AdvancedSearch({ onSearch, onReset }: AdvancedSearchProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            특허명 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <Input
            type="text"
            placeholder="예: 배터리, 통신, AI"
            {...register("patentName")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            출원인 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <Input
            type="text"
            placeholder="예: 삼성전자, LG전자"
            {...register("companyName")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            시작일 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <Input type="date" {...register("startDate")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            종료일 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <Input
            type="date"
            {...register("endDate")}
            className={errors.endDate ? "border-red-500" : ""}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            상태 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <select
            {...register("status")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">전체</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="h-10 px-6">
          <i className="ri-search-line mr-1.5" />
          검색
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} className="h-10 px-6">
          <i className="ri-refresh-line mr-1.5" />
          초기화
        </Button>
      </div>
    </form>
  );
}
