import { Link } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { useAuthStore } from "@/store/authStore";

const quickActions = [
  {
    title: "요약분석",
    desc: "IPC 분류·출원 추이·등록 상태를 시각화하여 R&D 인사이트를 도출합니다.",
    icon: "ri-pie-chart-line",
    link: "/summary",
    button: "분석하기",
  },
  {
    title: "특허검색",
    desc: "기업명·기간·상태별 조건으로 KIPRIS 특허 데이터를 실시간 검색합니다.",
    icon: "ri-search-line",
    link: "/patent-search",
    button: "검색하기",
  },
  {
    title: "관심특허",
    desc: "중요한 특허를 즐겨찾기로 저장하고 한곳에서 관리합니다.",
    icon: "ri-heart-line",
    link: "/favorites",
    button: "보러가기",
  },
  {
    title: "프리셋 관리",
    desc: "자주 쓰는 검색 조건을 프리셋으로 저장하여 반복 작업을 줄입니다.",
    icon: "ri-bookmark-line",
    link: "/preset-management",
    button: "관리하기",
  },
];

const stats = [
  { label: "공공 데이터 기반", value: "KIPRIS", icon: "ri-database-2-line" },
  { label: "분석 차트", value: "3종", icon: "ri-bar-chart-box-line" },
  { label: "검색 필터", value: "5가지", icon: "ri-filter-3-line" },
];

export default function HomePage() {
  const { userEmail } = useAuthStore();
  const displayName = userEmail?.split("@")[0] || "사용자";

  return (
    <ProtectedLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 인사 헤더 */}
        <section className="mb-8 sm:mb-10">
          <p className="text-sm text-gray-500 mb-1">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            안녕하세요, {displayName}님
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            특허 인텔리전스 플랫폼에서 오늘의 분석을 시작하세요.
          </p>
        </section>

        {/* 핵심 수치 */}
        <section className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-100 rounded-xl px-4 py-4 sm:py-5 text-center"
            >
              <i className={`${s.icon} text-xl sm:text-2xl text-brand-700 mb-2 block`} />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </section>

        {/* 퀵 액션 카드 */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {quickActions.map((card) => (
              <Link
                to={card.link}
                key={card.title}
                className="
                  group bg-white border border-gray-100 rounded-xl
                  p-5 flex items-start gap-4
                  hover:border-brand-200 hover:shadow-sm
                  transition-all duration-200
                "
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                  <i className={`${card.icon} text-lg text-brand-700`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {card.title}
                    </h3>
                    <i className="ri-arrow-right-s-line text-gray-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {card.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 도움말 배너 */}
        <section className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
            <i className="ri-lightbulb-line text-lg text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">처음 사용하시나요?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              도움말 페이지에서 특허 용어와 검색 팁을 확인하세요.
            </p>
          </div>
          <Link
            to="/help"
            className="text-xs font-medium text-brand-700 hover:text-brand-800 whitespace-nowrap"
          >
            도움말 보기 →
          </Link>
        </section>

        {/* 푸터 */}
        <footer className="mt-10 sm:mt-12 text-center text-[10px] text-gray-400">
          © 2025 <span className="font-medium text-gray-500">Woohyun Sim</span>. All rights reserved.
        </footer>
      </div>
    </ProtectedLayout>
  );
}
