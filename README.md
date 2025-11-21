<p align="center">
<img width="200" height="200" alt="TechLens로고" src="https://github.com/user-attachments/assets/3e8b41ac-733c-499a-b49b-bf32eee18ad8" />
</p>

# TechLens Frontend

TechLens Frontend는 특허 검색·분석 플랫폼 **TechLens**의 사용자 인터페이스를 구성하는 React 기반 애플리케이션입니다.  
KIPRIS 특허 데이터를 활용해 기업·기관의 R&D 분석을 지원하도록 설계되었습니다.

---

# 1. Project Overview

## 1.1 시스템 구성도

```
TechLens Platform
├── techlens-backend (separate repository)
│   ├── Node.js + Express
│   ├── PostgreSQL
│   ├── KIPRIS Open API Integration (xml2js)
│   ├── JWT + Refresh Token Security
│   └── REST API
│
└── techlens-frontend (this repository)
    ├── React 18 + TypeScript
    ├── Zustand
    ├── TailwindCSS UI
    ├── Chart.js Visualization
    ├── Vite Build
    └── Vercel Deployment
```

---

# 2. Features (페이지 단위 상세 설명)

TechLens는 “검색 → 분석 → 관리” 중심의 플로우로 구성되어 있으며, 각 페이지는 다음과 같은 역할을 담당합니다.

---

## 2.1 로그인 페이지 (Login)
- JWT 기반 인증 (Access Token + Refresh Token)
- 로그인 후 이전에 접근하던 페이지로 자동 복귀
- ProtectedRoute로 비로그인 사용자의 주요 페이지 접근 차단

---

## 2.2 메인 페이지 (Home)
- TechLens 서비스 소개 역할
- 검색·분석·관심특허·도움말 등 주요 기능으로 빠른 이동 지원
- 사용자 온보딩 및 서비스 구조 파악에 도움 제공

---

## 2.3 특허 검색 페이지 (Patent Search)

### 기본 검색
- 회사명(출원인) + 기간 지정으로 빠른 특허 검색
- 프론트에서 조건 전송 → 백엔드에서 KIPRIS 연동 처리
- 최신순 / 오래된순 정렬 제공

### 고급 검색
- 특허명, 출원인명, 상태(A/R/C 등), 날짜조건 등
- 복합 필터링 가능
- UI는 BasicSearch + AdvancedSearch 구성

### 검색 결과
- 리스트 / 테이블 형태 선택 가능
- 특허 상세 모달과 연동
- IPC 코드, 출원일, 상태 등 핵심 정보 표시
- 관심특허(즐겨찾기) 아이콘 지원

---

## 2.4 특허 상세 모달 (Patent Detail)
- 발명명칭 / 출원번호 / 출원일 등 특허 핵심 정보 표시
- IPC 전체 분류 리스트 표시
- 초록(요약) 렌더링
- 대표 도면(image URL) 표시
- 관심특허 추가 / 삭제 기능

---

## 2.5 분석 대시보드 페이지 (Summary Dashboard)

검색된 조건을 기준으로 분석 결과를 시각화하여 제공하는 페이지입니다.

- IPC 상위 5개 분포 (Pie)
- 월별 특허 출원 추이 (Bar)
- 등록 상태 분포 (Doughnut)
- 최근 주요 특허 3건 카드형 제공
- 프리셋과 연동하여 자동 분석 실행

---

## 2.6 프리셋 관리 페이지 (Preset Management)
- 자주 사용하는 검색 조건을 저장/편집/삭제
- 회사명 + 기간 + 상태코드 등 조건 유지
- Summary 및 Search 페이지와 자동 연동됨
- 프리셋 기반 분석 자동 실행 가능

---

## 2.7 관심특허 페이지 (Favorites)
- 사용자가 저장한 관심 특허 목록 관리
- 출원번호 기반 중복 방지
- 카드 UI로 주요 정보 제공
- 상세 모달과 연동하여 정확한 데이터 확인 가능

---

## 2.8 도움말 페이지 (Help)
기술/특허에 익숙하지 않은 사용자도 빠르게 이해할 수 있도록 지원하는 페이지.

- IPC 코드 상세 설명
- 특허 상태코드 안내 (공개/등록/취하/거절 등)
- 검색 가이드 및 필드 용어 설명
- 앱 사용 방법 안내

---

# 3. Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18, TypeScript |
| Build | Vite |
| State Management | Zustand |
| Router | React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Chart | Chart.js + react-chartjs-2 |
| Deployment | Vercel |

---

# 4. Directory Structure  
(실제 프로젝트 구조 그대로 반영)

```
src/
├── api/
│   ├── auth.ts
│   ├── axiosInstance.ts
│   ├── favorite.ts
│   ├── patent.ts
│   ├── preset.ts
│   └── summary.ts
│
├── assets/
│   └── .gitkeep
│
├── components/
│   ├── auth/
│   │     ├── Login.tsx
│   │     └── Signup.tsx
│   │
│   ├── common/
│   │     ├── ConfirmDeleteModal.tsx
│   │     ├── EmptyState.tsx
│   │     ├── ErrorState.tsx
│   │     ├── LoadingSpinner.tsx
│   │     ├── NoData.tsx
│   │     └── SearchForm.tsx
│   │
│   ├── Mobile/
│   │     └── MobileHeader.tsx
│   │
│   ├── Patent/
│   │     ├── PatentDetail/
│   │     │     └── PatentDetailModal.tsx
│   │     ├── PatentListComponent/
│   │     │     ├── Pagination.tsx
│   │     │     ├── PatentList.tsx
│   │     │     └── PatentTable.tsx
│   │     └── PatentSearch/
│   │           ├── AdvancedSearch.tsx
│   │           └── BasicSearch.tsx
│   │
│   ├── Preset/
│   │     ├── PresetCard.tsx
│   │     └── PresetModal.tsx
│   │
│   ├── ProtectedRoute/
│   │     └── ProtectedRoute.tsx
│   │
│   ├── Sidebar/
│   │     └── Sidebar.tsx
│   │
│   ├── Summary/
│   │     ├── RecentPatentCard.tsx
│   │     └── SummaryDashboard.tsx
│   │
│   └── ui/
│         ├── alert-dialog.tsx
│         ├── button.tsx
│         ├── toast.tsx
│         └── toaster.tsx
│
├── data/
│   └── helpSections.ts
│
├── hooks/
│   ├── use-toast.ts
│   ├── useFavorites.ts
│   ├── useInput.ts
│   ├── usePatentSearch.ts
│   ├── usePresets.ts
│   └── useSummaryAnalysis.ts
│
├── layouts/
│   └── ProtectedLayout.tsx
│
├── lib/
│   └── utils.ts
│
├── pages/
│   ├── FavoritesPage.tsx
│   ├── HelpPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── PatentSearchPage.tsx
│   ├── PresetManagementPage.tsx
│   ├── SignupPage.tsx
│   └── SummaryPage.tsx
│
├── store/
│   ├── authStore.ts
│   └── uiStore.ts
│
├── styles/
│   └── global.css
│
├── types/
│   ├── favorite.ts
│   ├── patent.ts
│   ├── preset.ts
│   └── summary.ts
│
├── utils/
│   ├── dateFormat.ts
│   ├── dateTransform.ts
│   ├── formatContent.tsx
│   └── statusColor.ts
│
├── App.tsx
└── main.tsx
```

---

# 5. API Reference

### Authentication  
- POST /users/login

### Patent Search  
- GET /patents/search?type=basic  
- GET /patents/search?type=advanced  
- GET /patents/:applicationNumber  

### Summary Analysis  
- GET /analysis/summary

### Presets  
- GET /presets  
- POST /presets  
- PUT /presets/:presetId  
- DELETE /presets/:presetId  

### Favorites  
- GET /favorites  
- POST /favorites  
- DELETE /favorites/:applicationNumber  

Full API Spec:  
https://github.com/Douzone-Keycom-Internship-woohyun-2025/Docs/blob/main/specs/TechLens_API_specificationsV1.0.md

---

# 6. Development Guide

### Commit Convention
```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
refactor: 코드 리팩토링
perf: 성능 개선
```

### Branch Strategy
```
main           → 배포
└── develop    → 개발 통합
      ├── feature/auth
      ├── feature/search
      ├── feature/analysis
      ├── feature/favorites
      └── feature/presets
```

---

# 7. Deployment

### Vercel 자동 배포  
- develop → Staging  
- main → Production  

### 배포 URL
- Staging: https://staging-frontend-techlens.vercel.app  
- Production: https://frontend-techlens.vercel.app  

---

# 8. Setup

### Clone
```
git clone https://github.com/YOUR_ORG/techlens-frontend.git
cd techlens-frontend
```

### Install
```
npm ci
```

### Environment (.env)
```
VITE_API_BASE_URL=https://techlens-backend-develop.onrender.com
```

### Run
```
npm run dev
```

접속: http://localhost:5173

---

# 9. Related Repositories
- Backend: https://github.com/Douzone-Keycom-Internship-woohyun-2025/Backend

---

# 10. 저작권(Copyright)

본 프로젝트의 모든 산출물(코드, UI, 문서, 디자인 등)은 **심우현 개인에게 귀속됩니다.**  
단, 기업 협업 산출물 특성상 KICOM(더존 Keycom)에 제공된 기능·구조는  
**KICOM 내부 사용 목적에 한해 공동 활용될 수 있습니다.**  

무단 복제, 배포, 상업적 이용을 금합니다.
