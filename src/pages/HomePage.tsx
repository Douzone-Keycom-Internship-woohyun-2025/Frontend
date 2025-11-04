import { Link } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";

export default function HomePage() {
  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto px-6 py-12 ml-64">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">T</span>ech
            <span className="text-blue-600">L</span>ens 특허 관리 시스템
          </h1>
          <p className="text-xl text-gray-600">
            효율적인 특허 검색과 분석을 위한 통합 플랫폼
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
            <Link to="/summary" className="block">
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                  <i className="ri-bar-chart-line w-8 h-8 flex items-center justify-center text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  요약분석
                </h3>
                <p className="text-gray-600 mb-6">
                  특허 동향과 통계를 분석하여 인사이트를 얻으세요. 시각적 차트와
                  상세한 리포트를 제공합니다.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                  <span>분석하기</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
            <Link to="/patent-search" className="block">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                  <i className="ri-search-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  특허검색
                </h3>
                <p className="text-gray-600 mb-6">
                  회사명, 날짜, 상태별로 특허를 검색하고 관리하세요. 빠른 검색과
                  상세 검색 기능을 제공합니다.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>검색하기</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
            <Link to="/favorites" className="block">
              <div className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors duration-300">
                  <i className="ri-heart-line w-8 h-8 flex items-center justify-center text-red-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  관심특허
                </h3>
                <p className="text-gray-600 mb-6">
                  관심있는 특허들을 즐겨찾기에 추가하고 한곳에서 관리하세요.
                  중요한 특허를 놓치지 마세요.
                </p>
                <div className="flex items-center text-red-600 font-medium">
                  <span>보러가기</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            주요 기능
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <i className="ri-building-line w-12 h-12 flex items-center justify-center text-blue-600 mx-auto mb-3"></i>
              <h4 className="font-medium text-gray-900 mb-2">회사별 검색</h4>
              <p className="text-sm text-gray-600">
                특정 회사의 특허를 빠르게 찾아보세요
              </p>
            </div>
            <div className="text-center">
              <i className="ri-calendar-line w-12 h-12 flex items-center justify-center text-green-600 mx-auto mb-3"></i>
              <h4 className="font-medium text-gray-900 mb-2">날짜 범위 검색</h4>
              <p className="text-sm text-gray-600">
                원하는 기간의 특허만 조회할 수 있습니다
              </p>
            </div>
            <div className="text-center">
              <i className="ri-flag-line w-12 h-12 flex items-center justify-center text-purple-600 mx-auto mb-3"></i>
              <h4 className="font-medium text-gray-900 mb-2">상태별 필터링</h4>
              <p className="text-sm text-gray-600">
                출원, 심사중, 등록 등 상태별로 분류
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
