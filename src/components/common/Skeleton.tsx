/** 특허 목록 행 스켈레톤 */
export function SkeletonPatentRows({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-2/5" />
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** 요약분석 대시보드 스켈레톤 */
export function SkeletonSummaryDashboard() {
  return (
    <div className="space-y-6">
      <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-7 bg-gray-200 rounded w-2/5" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        {[90, 70, 55, 40, 25].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded" style={{ width: `${w}%` }} />
                <div className="h-3 bg-gray-200 rounded w-12" />
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="flex items-end gap-2 h-44">
          {[40, 65, 45, 80, 55, 70, 35, 90, 60, 75, 50, 85].map((h, i) => (
            <div key={i} className="flex-1 bg-gray-200 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 프리셋 카드 스켈레톤 */
export function SkeletonPresetCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="h-4 bg-gray-200 rounded w-2/5" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/5" />
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-8 bg-gray-200 rounded-lg flex-1" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 특허 상세 모달 콘텐츠 스켈레톤 */
export function SkeletonPatentDetail() {
  return (
    <div className="flex flex-col">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-14" />
              <div className="h-5 bg-gray-200 rounded w-28" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-4/5" />
            <div className="flex gap-3">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5 animate-pulse">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/5 mb-3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
          <div className="h-3 bg-gray-200 rounded w-3/6" />
        </div>
      </div>
    </div>
  );
}
