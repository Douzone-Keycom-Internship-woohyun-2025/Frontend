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

          {/* 기능 요약 섹션 */}
          <div className="mt-10 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 text-center">
              주요 기능
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              {[
                {
                  icon: "ri-building-line",
                  color: "blue",
                  title: "회사별 검색",
                  desc: "특정 회사의 특허를 빠르게 찾아보세요",
                },
                {
                  icon: "ri-calendar-line",
                  color: "green",
                  title: "날짜 범위 검색",
                  desc: "원하는 기간의 특허만 조회할 수 있습니다",
                },
                {
                  icon: "ri-flag-line",
                  color: "purple",
                  title: "상태별 필터링",
                  desc: "출원, 심사중, 등록 등 상태별로 분류",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div
                    className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}
                  >
                    <i
                      className={`${item.icon} text-${item.color}-600 text-xl`}
                    ></i>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
