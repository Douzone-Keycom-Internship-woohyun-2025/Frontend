import { Link } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";

export default function HomePage() {
  const cards = [
    {
      title: "요약분석",
      desc: "특허 동향과 통계를 분석하여 인사이트를 얻으세요.",
      icon: "ri-bar-chart-line",
      link: "/summary",
      button: "분석하기",
      iconBg: "bg-green-100",
      iconHoverBg: "group-hover:bg-green-200",
      iconColor: "text-green-600",
      accent: "text-green-600",
    },
    {
      title: "특허검색",
      desc: "회사명, 날짜, 상태별로 특허를 검색하고 관리하세요.",
      icon: "ri-search-line",
      link: "/patent-search",
      button: "검색하기",
      iconBg: "bg-blue-100",
      iconHoverBg: "group-hover:bg-blue-200",
      iconColor: "text-blue-600",
      accent: "text-blue-600",
    },
    {
      title: "관심특허",
      desc: "관심있는 특허를 즐겨찾기에 추가하고 관리하세요.",
      icon: "ri-heart-line",
      link: "/favorites",
      button: "보러가기",
      iconBg: "bg-red-100",
      iconHoverBg: "group-hover:bg-red-200",
      iconColor: "text-red-500",
      accent: "text-red-500",
    },
  ];

  const features = [
    {
      icon: "ri-building-line",
      color: "text-blue-500",
      title: "회사별 검색",
      desc: "기업명으로 특허를 빠르게 찾아 관련 기술 동향을 파악할 수 있습니다.",
    },
    {
      icon: "ri-calendar-line",
      color: "text-green-500",
      title: "기간별 분석",
      desc: "연도나 분기별로 특허 데이터를 분석하여 변화 추이를 한눈에 볼 수 있습니다.",
    },
    {
      icon: "ri-flag-line",
      color: "text-purple-500",
      title: "상태별 필터링",
      desc: "출원·심사·등록 등 상태별로 손쉽게 분류하고 관리할 수 있습니다.",
    },
  ];

  return (
    <ProtectedLayout>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight leading-tight">
            <span className="text-blue-600">T</span>ech
            <span className="text-blue-600">L</span>ens 특허 관리 시스템
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            효율적인 특허 검색과 분석을 위한 통합 플랫폼
          </p>
        </div>

        {/* 주요 카드 섹션 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 justify-items-center mb-12 sm:mb-14">
          {cards.map((card) => (
            <Link
              to={card.link}
              key={card.title}
              className="
                w-full max-w-sm
                bg-white
                rounded-xl
                shadow-md
                hover:shadow-lg
                border border-gray-100
                transition-all duration-300
                p-5 sm:p-6
                flex flex-col
                group
              "
            >
              <div
                className={`
                  w-12 h-12 mb-4
                  rounded-lg
                  flex items-center justify-center
                  ${card.iconBg}
                  ${card.iconHoverBg}
                  transition-colors duration-300
                `}
              >
                <i className={`${card.icon} ${card.iconColor} text-2xl`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {card.desc}
              </p>
              <div
                className={`
                  mt-auto
                  flex items-center
                  text-sm font-medium
                  ${card.accent}
                `}
              >
                <span>{card.button}</span>
                <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </section>

        {/* 주요 기능 섹션 */}
        <section className="bg-white/70 border-t border-gray-100 pt-10 sm:pt-12 pb-10 sm:pb-12 px-2 sm:px-4 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
            TechLens 주요 기능
          </h3>
          <p className="text-gray-600 text-center mb-8 sm:mb-10 text-sm sm:text-base">
            효율적인 특허 검색과 분석을 위한 핵심 기능을 소개합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            {features.map((item, idx) => (
              <div key={idx} className="max-w-[260px] mx-auto">
                <i
                  className={`
                    ${item.icon}
                    ${item.color}
                    text-4xl sm:text-5xl
                    mb-3 sm:mb-4
                  `}
                />
                <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="mt-10 sm:mt-12 text-center text-[10px] sm:text-xs text-gray-400">
          © 2025 <span className="font-medium text-gray-500">Woohyun Sim</span>
          . All rights reserved.
        </footer>
      </div>
    </ProtectedLayout>
  );
}
