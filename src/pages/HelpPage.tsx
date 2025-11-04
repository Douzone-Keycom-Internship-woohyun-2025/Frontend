// src/pages/HelpPage.tsx
import { useState } from "react";
import ProtectedLayout from "../layouts/ProtectedLayout";

interface HelpSection {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const helpSections: HelpSection[] = [
  {
    id: "patent-dates",
    title: "특허 날짜 용어",
    icon: "ri-calendar-line",
    content: `
**출원일 (Application Date)**
특허 출원서를 특허청에 제출한 날짜입니다. 이 날짜부터 특허권의 존속기간이 계산되며, 선출원주의에 따라 동일한 발명에 대해서는 가장 먼저 출원한 자가 특허권을 취득할 수 있습니다.

**공개일 (Publication Date)**
특허 출원 내용이 일반에게 공개되는 날짜입니다. 일반적으로 출원일로부터 18개월 후에 자동으로 공개되며, 출원인이 조기공개를 신청할 경우 더 빨리 공개될 수 있습니다.

**공고일 (Announcement Date)**
특허 등록이 결정된 후 특허공보에 게재되어 일반에게 알려지는 날짜입니다. 이 날짜부터 특허권이 정식으로 발생하며, 제3자가 이의신청을 할 수 있는 기간이 시작됩니다.

**등록일 (Registration Date)**
특허청에서 특허 등록을 결정하고 특허원부에 등록한 날짜입니다. 이 날짜부터 특허권자는 독점적인 권리를 행사할 수 있으며, 특허권의 존속기간은 출원일로부터 20년입니다.
    `,
  },
  {
    id: "ipc-codes",
    title: "IPC 코드 (국제특허분류)",
    icon: "ri-code-line",
    content: `
**IPC (International Patent Classification)란?**
국제특허분류는 전 세계적으로 통일된 특허 분류 체계로, 특허 문헌을 기술 분야별로 체계적으로 분류하기 위해 사용됩니다.

**IPC 코드 구조**
IPC 코드는 다음과 같은 계층 구조로 이루어져 있습니다:
- **섹션 (Section)**: A~H까지 8개 대분류
- **클래스 (Class)**: 2자리 숫자
- **서브클래스 (Subclass)**: 1개 알파벳
- **그룹 (Group)**: 숫자/숫자 형태

**주요 섹션별 분류**
- **A**: 생활필수품 (의료, 농업, 식품 등)
- **B**: 처리조작, 운수 (기계, 운송수단 등)
- **C**: 화학, 야금 (화학물질, 재료 등)
- **D**: 섬유, 지류 (섬유, 종이 등)
- **E**: 고정구조물 (건축, 토목 등)
- **F**: 기계공학, 조명, 가열 (엔진, 펌프 등)
- **G**: 물리학 (광학, 전자, 컴퓨터 등)
- **H**: 전기 (전자회로, 통신 등)

**예시: G06F 17/30**
- G: 물리학 섹션
- 06: 계산, 계수 클래스
- F: 전기적 디지털 데이터 처리 서브클래스
- 17/30: 데이터베이스 구조 관련 그룹
    `,
  },
  {
    id: "patent-status",
    title: "특허 상태 용어",
    icon: "ri-file-list-line",
    content: `
**출원 (Application)**
특허 출원서가 특허청에 접수된 상태입니다. 아직 심사가 시작되지 않은 단계로, 출원인은 출원일로부터 3년 이내에 심사청구를 해야 합니다.

**심사중 (Under Examination)**
특허청 심사관이 특허 요건을 검토하고 있는 상태입니다. 신규성, 진보성, 산업상 이용가능성 등을 종합적으로 판단합니다.

**공개 (Published)**
출원 내용이 특허공보에 게재되어 일반에게 공개된 상태입니다. 출원일로부터 18개월 후 자동 공개되거나 출원인의 조기공개 신청에 의해 공개됩니다.

**등록 (Registered)**
특허청의 심사를 통과하여 특허권이 부여된 상태입니다. 특허권자는 독점적인 권리를 행사할 수 있으며, 특허료를 납부해야 합니다.

**거절 (Rejected)**
특허 요건을 충족하지 못하여 특허청에서 특허 등록을 거부한 상태입니다. 출원인은 거절결정에 대해 불복할 수 있습니다.

**포기 (Abandoned)**
출원인이 특허 출원을 포기하거나, 필요한 절차를 이행하지 않아 출원이 취하된 상태입니다.
    `,
  },
  {
    id: "summary-analysis",
    title: "요약분석 사용법",
    icon: "ri-bar-chart-line",
    content: `
**요약분석이란?**
특정 회사의 특허 출원 현황을 종합적으로 분석하여 R&D 동향과 기술 역량을 한눈에 파악할 수 있는 기능입니다. 회사명과 분석 기간을 입력하면 다양한 통계와 차트로 결과를 제공합니다.

**주요 분석 지표**
- **총 특허 건수**: 해당 기간 동안의 전체 특허 출원 건수
- **등록률**: 출원된 특허 중 실제로 등록된 특허의 비율
- **증감률**: 최근 3개월과 이전 3개월 대비 출원 건수 변화율
- **월평균 출원**: 분석 기간 동안의 월평균 특허 출원 건수

**시각화 차트**
- **IPC 코드별 분포**: 기술 분야별 특허 출원 현황을 파이차트로 표시
- **월별 출원 동향**: 시간에 따른 특허 출원 추이를 선 그래프로 표시
- **상태별 분포**: 특허의 현재 상태(등록, 심사중, 거절 등)를 도넛차트로 표시

**검색 조건 설정**
- **회사명**: 분석하고자 하는 회사의 정확한 명칭을 입력
- **시작일/종료일**: 분석 기간을 설정 (선택사항, 미입력 시 전체 기간 분석)
- **프리셋 저장**: 자주 사용하는 검색 조건을 저장하여 재사용 가능

**활용 방법**
경쟁사 분석, 기술 동향 파악, 투자 의사결정, 연구개발 전략 수립 등 다양한 목적으로 활용할 수 있습니다. 분석 결과를 바탕으로 특허목록 페이지에서 상세한 특허 정보를 확인할 수도 있습니다.
    `,
  },
];

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string>("patent-dates");

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h4
            key={index}
            className="font-semibold text-gray-900 mt-4 mb-2 first:mt-0"
          >
            {line.replace(/\*\*/g, "")}
          </h4>
        );
      }
      if (line.startsWith("- **")) {
        const parts = line.split("**");
        return (
          <div key={index} className="ml-4 mb-2">
            <span className="font-medium text-gray-900">{parts[1]}</span>
            <span className="text-gray-700">: {parts[2]}</span>
          </div>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={index} className="ml-4 mb-1 text-gray-700">
            {line.substring(2)}
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={index} className="h-2"></div>;
      }
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 ml-64">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">도움말</h1>
                <p className="mt-2 text-gray-600">
                  특허 검색 및 분석에 필요한 용어와 팁을 확인하세요
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 탭 네비게이션 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6">
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
                  <i
                    className={`${section.icon} w-5 h-5 flex items-center justify-center mr-2`}
                  ></i>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow">
            {helpSections.map((section) => (
              <div
                key={section.id}
                className={`p-8 ${activeSection === section.id ? "block" : "hidden"}`}
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
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-external-link-line w-4 h-4 flex items-center justify-center mr-2"></i>
                    KIPRIS 특허정보검색
                  </a>
                  <a
                    href="https://www.kipo.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-government-line w-4 h-4 flex items-center justify-center mr-2"></i>
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
