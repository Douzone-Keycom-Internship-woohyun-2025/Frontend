import { useState } from "react";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { helpSections } from "@/data/helpSections";
import { formatContent } from "@/utils/formatContent";

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const activeData = helpSections.find((s) => s.id === activeSection)!;

  return (
    <ProtectedLayout>
      <div className="w-full">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                <i className="ri-question-line text-lg text-brand-700" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  도움말
                </h1>
                <p className="text-xs text-gray-500">
                  특허 검색 및 분석에 필요한 용어와 팁
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 좌측 네비게이션 */}
            <aside className="lg:w-56 shrink-0">
              {/* 모바일: 가로 스크롤 탭 */}
              <nav className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 pb-1">
                {helpSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap
                      transition-colors
                      ${activeSection === section.id
                        ? "bg-brand-50 text-brand-800"
                        : "text-gray-500 hover:bg-gray-50"
                      }
                    `}
                  >
                    <i className={`${section.icon} text-sm`} />
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* 데스크탑: 세로 리스트 */}
              <div className="hidden lg:block bg-white border border-gray-100 rounded-xl p-2">
                <p className="px-3 pt-2 pb-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Topics
                </p>
                <ul className="space-y-0.5">
                  {helpSections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium
                          transition-all duration-150 text-left
                          ${activeSection === section.id
                            ? "bg-brand-50 text-brand-800"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <i className={`${section.icon} text-base ${activeSection === section.id ? "text-brand-700" : "text-gray-400"}`} />
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 외부 링크 */}
              <div className="hidden lg:block mt-4 bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Resources
                </p>
                <div className="space-y-2">
                  <a
                    href="https://www.kipris.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-700 transition-colors"
                  >
                    <i className="ri-external-link-line text-sm" />
                    KIPRIS 특허정보검색
                  </a>
                  <a
                    href="https://www.kipo.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-700 transition-colors"
                  >
                    <i className="ri-external-link-line text-sm" />
                    특허청 홈페이지
                  </a>
                </div>
              </div>
            </aside>

            {/* 우측 콘텐츠 */}
            <main className="flex-1 min-w-0">
              <article className="bg-white border border-gray-100 rounded-xl">
                {/* 콘텐츠 헤더 */}
                <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                      <i className={`${activeData.icon} text-lg text-brand-700`} />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      {activeData.title}
                    </h2>
                  </div>
                </div>

                {/* 콘텐츠 본문 */}
                <div className="px-5 sm:px-6 py-5 sm:py-6 text-sm text-gray-700 leading-relaxed">
                  {formatContent(activeData.content)}
                </div>
              </article>

              {/* 모바일 외부 링크 */}
              <div className="lg:hidden mt-4 bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900 mb-1">외부 리소스</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.kipris.or.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-700 hover:text-brand-800"
                    >
                      KIPRIS →
                    </a>
                    <a
                      href="https://www.kipo.go.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-700 hover:text-brand-800"
                    >
                      특허청 →
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
