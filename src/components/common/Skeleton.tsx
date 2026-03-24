import { memo } from "react";

interface SkeletonProps {
  className?: string;
}

function SkeletonBase({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
}

export const Skeleton = memo(SkeletonBase);

/** 검색 결과 테이블 Skeleton */
export function PatentTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

/** 차트 카드 Skeleton */
export function ChartSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

/** 통계 카드 Skeleton */
export function StatCardSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/** 프리셋 카드 Skeleton */
export function PresetCardSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

/** 즐겨찾기 카드 Skeleton */
export function FavoriteCardSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
