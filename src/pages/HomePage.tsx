import { Link } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";

export default function HomePage() {
  return (
    <ProtectedLayout>
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="w-full max-w-6xl px-6 py-10">
          {/* 헤더 섹션 */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              <span className="text-blue-600">T</span>ech
              <span className="text-blue-600">L</span>ens 특허 관리 시스템
            </h1>
            <p className="text-base text-gray-600">
              효율적인 특허 검색과 분석을 위한 통합 플랫폼
            </p>
          </div>

          {/* 주요 카드 섹션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {[
              {
                title: "요약분석",
                desc: "특허 동향과 통계를 분석하여 인사이트를 얻으세요.",
                color: "green",
                icon: "ri-bar-chart-line",
                link: "/summary",
                button: "분석하기",
              },
              {
                title: "특허검색",
                desc: "회사명, 날짜, 상태별로 특허를 검색하고 관리하세요.",
                color: "blue",
                icon: "ri-search-line",
                link: "/patent-search",
                button: "검색하기",
              },
              {
                title: "관심특허",
                desc: "관심있는 특허를 즐겨찾기에 추가하고 관리하세요.",
                color: "red",
                icon: "ri-heart-line",
                link: "/favorites",
                button: "보러가기",
              },
            ].map((card) => (
              <Link
                to={card.link}
                key={card.title}
                className="w-full max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 group"
              >
                <div
                  className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${card.color}-200 transition-colors duration-300`}
                >
                  <i
                    className={`${card.icon} text-${card.color}-600 text-2xl`}
                  ></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {card.desc}
                </p>
                <div
                  className={`flex items-center text-${card.color}-600 font-medium text-sm`}
                >
                  <span>{card.button}</span>
                  <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </Link>
            ))}
          </div>

          <section className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              TechLens 주요 기능
            </h3>
            <p className="text-gray-600 mb-12">
              TechLens는 특허 데이터를 쉽고 빠르게 검색하고, 분석하며, 관리할 수
              있는 통합 플랫폼입니다.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-10 sm:gap-16">
              {[
                {
                  icon: "ri-building-line",
                  color: "text-blue-600",
                  title: "회사별 검색",
                  desc: "기업명을 기준으로 관련 특허를 신속히 조회",
                },
                {
                  icon: "ri-calendar-line",
                  color: "text-green-600",
                  title: "기간별 분석",
                  desc: "연도 또는 분기별 트렌드를 한눈에 확인",
                },
                {
                  icon: "ri-flag-line",
                  color: "text-purple-600",
                  title: "상태별 필터링",
                  desc: "출원·심사·등록 등 상태별로 특허 분류",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center max-w-[220px]"
                >
                  <i className={`${item.icon} ${item.color} text-4xl mb-3`} />
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ProtectedLayout>
  );
}
