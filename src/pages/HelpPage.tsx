// src/pages/HelpPage.tsx
import { useState } from "react";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { helpSections } from "../data/helpSections";
import { formatContent } from "../utils/formatContent";

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("patent-dates");

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">도움말</h1>
            <p className="mt-2 text-gray-600">
              특허 검색 및 분석에 필요한 용어와 팁을 확인하세요
            </p>
          </div>
        </header>

        {/* 탭 네비게이션 */}
        <div className="bg-white border-b">
          <div className="px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                    activeSection === section.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={`${section.icon} w-5 h-5 mr-2`}></i>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <main className="px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {helpSections.map((section) => (
              <div
                key={section.id}
                className={`p-8 ${
                  activeSection === section.id ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4">
                    <i className={`${section.icon} text-xl text-blue-600`}></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div>{formatContent(section.content)}</div>
              </div>
            ))}
          </div>

          {/* 추가 도움말 */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg mr-4 mt-1">
                <i className="ri-lightbulb-line text-blue-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  더 많은 도움이 필요하신가요?
                </h3>
                <p className="text-blue-800 mb-4">
                  특허 검색이나 분석에 대해 더 자세한 정보가 필요하시면 아래
                  리소스를 참고하세요.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.kipris.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <i className="ri-external-link-line w-4 h-4 mr-2"></i>
                    KIPRIS 특허정보검색
                  </a>
                  <a
                    href="https://www.kipo.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <i className="ri-government-line w-4 h-4 mr-2"></i>
                    특허청 홈페이지
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}
