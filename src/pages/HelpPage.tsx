import { useState } from "react";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { helpSections } from "../data/helpSections";
import { formatContent } from "../utils/formatContent";

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("patent-dates");

  return (
    <ProtectedLayout>
      <div className="w-full bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              도움말
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
              특허 검색 및 분석에 필요한 용어와 팁을 확인하세요
            </p>
          </div>
        </header>

        <div className="bg-white border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex overflow-x-auto no-scrollbar space-x-4 sm:space-x-8">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex items-center
                    px-1 py-3 sm:py-4
                    border-b-2
                    font-medium
                    text-xs sm:text-sm
                    transition-colors duration-200
                    whitespace-nowrap
                    ${
                      activeSection === section.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <i
                    className={`${section.icon} w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2`}
                  />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-lg shadow">
            {helpSections.map((section) => (
              <div
                key={section.id}
                className={`
                  ${activeSection === section.id ? "block" : "hidden"}
                  px-4 sm:px-6 lg:px-8
                  py-5 sm:py-6 lg:py-8
                `}
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-3 sm:mr-4">
                    <i
                      className={`${section.icon} text-lg sm:text-xl text-blue-600`}
                    />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {formatContent(section.content)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 bg-blue-50 rounded-lg p-4 sm:p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg mr-3 sm:mr-4 mt-0.5">
                <i className="ri-lightbulb-line text-blue-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-1.5 sm:mb-2">
                  더 많은 도움이 필요하신가요?
                </h3>
                <p className="text-xs sm:text-sm text-blue-800 mb-3 sm:mb-4">
                  특허 검색이나 분석에 대해 더 자세한 정보가 필요하시면 아래
                  리소스를 참고하세요.
                </p>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  <a
                    href="https://www.kipris.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center
                      px-3 sm:px-4 py-2
                      bg-blue-600 text-white
                      text-xs sm:text-sm
                      rounded-lg
                      hover:bg-blue-700
                      transition-colors duration-200
                    "
                  >
                    <i className="ri-external-link-line w-4 h-4 mr-1.5" />
                    KIPRIS 특허정보검색
                  </a>
                  <a
                    href="https://www.kipo.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center
                      px-3 sm:px-4 py-2
                      bg-white text-blue-600
                      text-xs sm:text-sm
                      border border-blue-600
                      rounded-lg
                      hover:bg-blue-50
                      transition-colors duration-200
                    "
                  >
                    <i className="ri-government-line w-4 h-4 mr-1.5" />
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
