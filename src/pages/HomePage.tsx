import { Link } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";

const quickActions = [
  {
    title: "요약분석",
    desc: "IPC 분류·출원 추이·등록 상태를 시각화하여 R&D 인사이트를 도출합니다.",
    icon: "ri-pie-chart-line",
    link: "/summary",
  },
  {
    title: "특허검색",
    desc: "기업명·기간·상태별 조건으로 KIPRIS 특허 데이터를 실시간 검색합니다.",
    icon: "ri-search-line",
    link: "/patent-search",
  },
  {
    title: "관심특허",
    desc: "중요한 특허를 즐겨찾기로 저장하고 한곳에서 관리합니다.",
    icon: "ri-heart-line",
    link: "/favorites",
  },
  {
    title: "프리셋 관리",
    desc: "자주 쓰는 검색 조건을 프리셋으로 저장하여 반복 작업을 줄입니다.",
    icon: "ri-bookmark-line",
    link: "/preset-management",
  },
];

const features = [
  { icon: "ri-database-2-line", label: "KIPRIS 공공데이터 기반" },
  { icon: "ri-bar-chart-box-line", label: "IPC·추이·상태 3종 차트" },
  { icon: "ri-filter-3-line", label: "5가지 상세 검색 필터" },
  { icon: "ri-bookmark-line", label: "프리셋 저장 및 재사용" },
];

export default function HomePage() {
  return (
    <ProtectedLayout>
      <div className="w-full">
        {/* 히어로 배너 */}
        <section className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-300 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.svg" alt="TechLens" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  TechLens
                </h1>
                <p className="text-brand-200 text-xs -mt-0.5">Patent Intelligence Platform</p>
              </div>
            </div>

            <p className="text-brand-100 text-sm sm:text-base max-w-md leading-relaxed mb-6">
              KIPRIS 공공데이터 기반으로 기업 특허를 검색하고,
              기술 동향을 시각적으로 분석하세요.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/summary"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-brand-800 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors"
              >
                <i className="ri-pie-chart-line" />
                요약분석 시작하기
              </Link>
              <Link
                to="/patent-search"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                <i className="ri-search-line" />
                특허 검색
              </Link>
            </div>
          </div>
        </section>

        {/* 플랫폼 특징 태그 */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-x-6 gap-y-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-gray-500">
                <i className={`${f.icon} text-brand-600 text-sm`} />
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* 퀵 액션 카드 */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
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
      </div>
    </ProtectedLayout>
  );
}
