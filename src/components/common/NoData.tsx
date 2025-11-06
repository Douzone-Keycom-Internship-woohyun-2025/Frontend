export default function NoData({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
      <i className="ri-bar-chart-2-line text-3xl mb-2"></i>
      <p>{message || "데이터가 없습니다."}</p>
    </div>
  );
}
