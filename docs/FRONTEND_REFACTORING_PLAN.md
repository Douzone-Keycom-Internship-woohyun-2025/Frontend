# TechLens Frontend 리팩토링 계획

## 진행 현황

| Phase | 상태 | PR |
|-------|------|----|
| P1 — 죽은 코드 제거 + Critical 버그 수정 | ✅ 완료 | #25, #26 |
| P2 — 코드 정리 마무리 | ✅ 완료 | #28 |
| P3 — 디렉토리 구조 정리 + TanStack Query 도입 | ✅ 완료 | #27, #29 |
| P4 — react-hook-form + Zod 폼 검증 도입 | ✅ 완료 | #31 |
| P5 — 코드 스플리팅 + 성능 최적화 | ✅ 완료 | #32 |
| P6 — 디자인 시스템 통일 (shadcn) | ✅ 완료 | #33 |
| P7 — UX 개선 (Skeleton·ErrorBoundary·Toast·a11y) | ✅ 완료 | #35, #37, #38 |
| P8 — 반응형 구현 (모바일·태블릿·PC) | ✅ 완료 | #39 |
| P-Demo — 포트폴리오 데모 로그인 | ✅ 완료 | #40, #41, #42 |
| P-RateLimit — KIPRIS API 조회 한도 (프론트) | ✅ 완료 | #43 |
| P9 — 테스트 코드 작성 | 🔲 예정 | — |
| P10 — 랜딩 페이지 | 🔲 예정 | — |
| P11 — Lighthouse 성능 최적화 | 🔲 예정 | — |

---

## P7 — UX 개선 ✅

### 완료된 작업 (PR #35, #37, #38)

| 항목 | 파일 | 내용 |
|------|------|------|
| Skeleton UI | `components/common/Skeleton.tsx` | 검색결과·대시보드·즐겨찾기·특허상세 전용 스켈레톤 |
| 특허 상세 모달 리디자인 | `PatentDetailModal.tsx` | 날짜 카드 3분할·IPC 배지·메모 편집 |
| 요약분석 대시보드 리디자인 | `SummaryDashboard.tsx` | 인사이트 바·핵심 지표 카드·IPC 바 차트 |
| 관심특허 페이지 리디자인 | `FavoritesPage.tsx` | 통계 스트립·분석 요약 바·1클릭 CSV 내보내기 |
| 경쟁사 비교 페이지 | `ComparisonDashboard.tsx` | 라인차트·상태차트·IPC 비교·요약 테이블 |
| 접근성(a11y) | PatentTable·PresetModal·SearchForm | aria-label 행동 기술·label htmlFor 연결·프리셋 이탈 감지 수정 |
| 에러 재시도 | `PatentList.tsx` | 상세 로드 실패 시 모달 내 에러+재시도 버튼 |
| 차트 가독성 | SummaryDashboard·ComparisonDashboard | x축 maxRotation:0, maxTicksLimit 설정 |

---

## P8 — 반응형 구현 ✅

### 완료된 작업 (PR #39)

| 항목 | 파일 | 내용 |
|------|------|------|
| 모달 바텀시트 패턴 | `PatentDetailModal.tsx` | 모바일: 아래서 슬라이드업 + 드래그핸들(탭으로 닫기), 데스크탑: 센터 모달 |
| 차트 높이 반응형 | `SummaryDashboard.tsx` | `h-44 sm:h-56` (바), `h-44 sm:h-52` (도넛) |
| 차트 높이 반응형 | `ComparisonDashboard.tsx` | `h-48 sm:h-64` (라인·상태 차트) |
| 비교 요약 테이블 이중 뷰 | `ComparisonDashboard.tsx` | 모바일 카드뷰(`sm:hidden`) + 데스크탑 테이블(`hidden sm:block`) |
| IPC 라벨 너비 | `ComparisonDashboard.tsx` | `w-14 sm:w-20` |
| 페이지 패딩 반응형 | `SummaryPage`, `ComparisonPage` | `px-4 sm:px-6 lg:px-8`, 카드 `p-4 sm:p-6 lg:p-8` |
| 페이지네이션 오버플로 | `Pagination.tsx` | `overflow-x-auto` + 내부 `w-max` 래퍼 |
| 통계 스트립 줄바꿈 | `FavoritesPage.tsx` | `flex-wrap` 추가 |
| no-scrollbar 유틸 | `global.css` | webkit/Firefox 스크롤바 숨김 정의 |

### 테스트 뷰포트
- 320px (iPhone SE), 375px (iPhone 14), 768px (iPad), 1024px+ (노트북/PC)

---

## P-Demo — 포트폴리오 데모 로그인 ✅

### 완료된 작업 (PR #40, #41, #42)

| 항목 | 내용 |
|------|------|
| 데모 로그인 버튼 | 로그인 페이지 하단 구분선 + `bg-brand-50` 아웃라인 버튼, hover 시 solid brand-700 |
| 자동 로그인 | `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD` 환경변수로 1클릭 로그인 |
| 안전 설계 | env 변수 없으면 버튼 자동 숨김 (프로덕션 환경 안전) |
| 데모 계정 | 백엔드에 `demo@techlens.kr` 계정 생성 완료 |

---

## P-RateLimit — KIPRIS API 조회 한도 ✅

### 완료된 작업 (Frontend PR #43 / Backend PR #45)

| 항목 | 내용 |
|------|------|
| 유저 단위 한도 | 데모 계정 **30회/일**, 일반 유저 **200회/일** |
| 적용 범위 | 특허 검색(basic/advanced), 특허 상세, 요약분석, 경쟁사 비교 |
| 키 방식 | IP → **유저 ID 기반** (로그인 후 정확하게 추적) |
| 프론트 UX | 429 응답 시 전역 토스트 자동 표시 (백엔드 메시지 그대로 출력) |

---

## P9 — 테스트 코드 작성

> 핵심 기능에 대한 자동화 테스트 도입

### 환경 셋업

```
vitest + @testing-library/react + @testing-library/jest-dom + msw
```

### 테스트 범위

| 레벨 | 대상 | 파일 |
|------|------|------|
| 유틸 단위 테스트 | dateTransform, statusColor, favoritePayload | `utils/__tests__/` |
| 컴포넌트 테스트 | LoadingSpinner, ErrorState, EmptyState, Button | `components/__tests__/` |
| 훅 테스트 | usePatentSearch, useFavorites, usePresets | `hooks/__tests__/` |
| 통합 테스트 | 로그인 → 보호 라우트 → 홈 흐름 | `pages/__tests__/` |
| API 모킹 | MSW 핸들러 (auth, patent, favorite, summary) | `mocks/` |

### 커버리지 목표

- 유틸 함수: 90%+
- 커스텀 훅: 70%+
- 핵심 페이지 흐름: 60%+

---

## P10 — 랜딩 페이지

> 비로그인 사용자를 위한 서비스 소개 페이지

### 구성

| 섹션 | 설명 |
|------|------|
| Hero | 서비스 한 줄 소개 + CTA (데모 로그인/회원가입) |
| Features | 주요 기능 4개 카드 (특허 검색, 요약 분석, 경쟁사 비교, 관심특허) |
| How it works | 사용 흐름 3단계 시각화 |
| CTA | 하단 데모 체험 / 회원가입 유도 버튼 |

### 라우팅 변경

```
현재: / → HomePage (로그인 필요)
변경: /landing → LandingPage (퍼블릭)
      / → HomePage (로그인 필요)
      비로그인 시 / 접근 → /landing 리다이렉트
```

---

## P11 — Lighthouse 성능 최적화

> 리팩토링 전후 성능 점수 측정 + 최적화

### 측정 항목

| 항목 | 목표 |
|------|------|
| Performance | 90+ |
| Accessibility | 90+ |
| Best Practices | 90+ |
| SEO | 90+ |

### 최적화 대상

| 항목 | 파일 | 설명 |
|------|------|------|
| 번들 분석 | `vite.config.ts` | `rollup-plugin-visualizer`로 번들 크기 분석 |
| 폰트 최적화 | `index.html` | Pretendard self-hosted + `font-display: swap` |
| 메타 태그 | `index.html` | Open Graph, description, title 추가 |
| 시맨틱 HTML | 전체 | `<main>`, `<nav>`, `<section>`, `<article>` 적용 |
| chunk 분리 | `vite.config.ts` | vendor chunk (react, chart.js 등) 분리 |

---

## 실행 순서

```
P1~P8 + P-Demo + P-RateLimit ✅
 → P9 (테스트 코드)
 → P10 (랜딩 페이지)
 → P11 (Lighthouse 측정 + 최적화)
```

> P11은 P9~P10 완료 후 최종 측정해야 전후 비교가 의미있으므로 마지막에 진행
