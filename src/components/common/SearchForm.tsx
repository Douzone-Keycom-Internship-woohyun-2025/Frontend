import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  basicSearchSchema,
  type BasicSearchFormData,
} from "@/validators/searchSchemas";
import { usePresets } from "@/hooks/usePresets";
import { toInputDateFormat, toApiDateFormat } from "@/utils/dateTransform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormParams {
  applicant: string;
  startDate: string;
  endDate: string;
}

interface SearchFormProps {
  onSearch: (params: SearchFormParams) => void;
  enablePresets?: boolean;
  title?: string;
  loading?: boolean;
  initialValues?: Partial<SearchFormParams>;
  selectedPresetId: string;
  onPresetChange: (id: string) => void;
  showTitle?: boolean;
}

export default function SearchForm({
  onSearch,
  enablePresets = false,
  title = "검색",
  loading = false,
  initialValues,
  selectedPresetId,
  onPresetChange,
  showTitle = true,
}: SearchFormProps) {
  const { presets, isLoading: presetLoading, error } = usePresets();

  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const oneMonthAgo = useMemo(
    () => dayjs().subtract(1, "month").format("YYYY-MM-DD"),
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BasicSearchFormData>({
    resolver: zodResolver(basicSearchSchema),
    defaultValues: {
      applicant: "",
      startDate: oneMonthAgo,
      endDate: today,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (initialValues) {
      reset({
        applicant: initialValues.applicant ?? "",
        startDate: toInputDateFormat(initialValues.startDate ?? oneMonthAgo),
        endDate: toInputDateFormat(initialValues.endDate ?? today),
      });
    }
  }, [initialValues, oneMonthAgo, today, reset]);

  const handleSelectPreset = (presetId: string) => {
    onPresetChange(presetId);
    if (presetId === "") {
      reset({ applicant: "", startDate: oneMonthAgo, endDate: today });
      return;
    }
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    reset({
      applicant: preset.applicant,
      startDate: toInputDateFormat(preset.startDate),
      endDate: toInputDateFormat(preset.endDate),
    });
  };

  const handleFieldChange = (field: keyof BasicSearchFormData, value: string) => {
    setValue(field, value, { shouldValidate: false });
    if (selectedPresetId) {
      const preset = presets.find((p) => p.id === selectedPresetId);
      if (preset) {
        const newData = { ...watchedValues, [field]: value };
        const matches =
          preset.applicant === newData.applicant &&
          toInputDateFormat(preset.startDate) === newData.startDate &&
          toInputDateFormat(preset.endDate) === newData.endDate;
        if (!matches) onPresetChange("");
      }
    }
  };

  const onValid = (data: BasicSearchFormData) => {
    onSearch({
      applicant: data.applicant.trim(),
      startDate: toApiDateFormat(data.startDate),
      endDate: toApiDateFormat(data.endDate),
    });
  };

  const handleReset = () => {
    onPresetChange("");
    reset({ applicant: "", startDate: oneMonthAgo, endDate: today });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      {showTitle && (
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}

      {enablePresets && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              저장된 프리셋
            </label>
            {selectedPresetId === "" && watchedValues.applicant && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <i className="ri-information-line" />
                프리셋과 다른 값이 입력되었습니다
              </span>
            )}
          </div>
          {presetLoading ? (
            <div className="h-9 w-full rounded-md bg-gray-100 animate-pulse border border-gray-200" />
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">프리셋 선택</option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            출원인
          </label>
          <Input
            type="text"
            {...register("applicant")}
            onChange={(e) => handleFieldChange("applicant", e.target.value)}
            className={errors.applicant ? "border-red-500" : ""}
            placeholder="예: 삼성, LG, 네이버"
          />
          {errors.applicant && (
            <p className="mt-1 text-xs text-red-600">{errors.applicant.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            시작일
          </label>
          <Input
            type="date"
            {...register("startDate")}
            onChange={(e) => handleFieldChange("startDate", e.target.value)}
            className={errors.startDate ? "border-red-500" : ""}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            종료일
          </label>
          <Input
            type="date"
            {...register("endDate")}
            onChange={(e) => handleFieldChange("endDate", e.target.value)}
            className={errors.endDate ? "border-red-500" : ""}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="h-10 px-6">
          {loading ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-1.5" />
              검색 중...
            </>
          ) : (
            <>
              <i className="ri-search-line mr-1.5" />
              검색
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} className="h-10 px-6">
          <i className="ri-refresh-line mr-1.5" />
          초기화
        </Button>
      </div>
    </form>
  );
}
