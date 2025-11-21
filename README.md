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
## 1.2 프로젝트 역할 (Project Roles)

| 이름 | 소속 / 직책 | 역할 |
|------|-------------|-------|
| **심우현** |  인턴 | Full-stack 개발 (Frontend + Backend), 시스템 설계, API 문서화, UI/UX 구현 |
| **박효민** | 더존 Keycom  선임연구원 | 프로젝트 기술 멘토링, 아키텍처 검토, 개발 프로젝트 전체 멘토링, 문서 검토  |
| **양태인** | 더존 Keycom 주임연구원 | 개발 방향성 조언 |


---

# 2. Features (페이지 단위 상세 설명)

TechLens는 “검색 → 분석 → 관리” 중심의 플로우로 구성되어 있으며, 각 페이지는 다음과 같은 역할을 담당합니다.

---

## 2.1 로그인 페이지 (Login)
<img width="819" height="803" alt="스크린샷 2025-11-21 120532" src="https://github.com/user-attachments/assets/616f2c40-ef1f-46fc-8818-fee2d76783cb" />
<img width="937" height="808" alt="스크린샷 2025-11-21 120543" src="https://github.com/user-attachments/assets/5befcb50-ac48-45f3-9d8e-17df08f03b54" />

- JWT 기반 인증 (Access Token + Refresh Token)
- 로그인 후 이전에 접근하던 페이지로 자동 복귀
- ProtectedRoute로 비로그인 사용자의 주요 페이지 접근 차단

---

## 2.2 메인 페이지 (Home)
<img width="1891" height="904" alt="image" src="https://github.com/user-attachments/assets/5b128c57-43a6-45fe-9912-2d65941abbd9" />

- TechLens 서비스 소개 역할
- 검색·분석·관심특허·도움말 등 주요 기능으로 빠른 이동 지원
- 사용자 온보딩 및 서비스 구조 파악에 도움 제공


---

## 2.3 특허 검색 페이지 (Patent Search)

<img width="1499" height="557" alt="스크린샷 2025-11-21 120823" src="https://github.com/user-attachments/assets/928c1878-bed2-4db0-a371-90e8fb26b7b6" />

### 기본 검색
- 회사명(출원인) + 기간 지정으로 빠른 특허 검색
- 프론트에서 조건 전송 → 백엔드에서 KIPRIS 연동 처리
- 최신순 / 오래된순 정렬 제공
- 
<img width="1498" height="659" alt="스크린샷 2025-11-21 120831" src="https://github.com/user-attachments/assets/7785ba20-17bc-4b55-bcec-af032d11e4d2" />
### 고급 검색
- 특허명, 출원인명, 상태(A/R/C 등), 날짜조건 등
- 복합 필터링 가능
- UI는 BasicSearch + AdvancedSearch 구성

<img width="1470" height="818" alt="스크린샷 2025-11-21 120847" src="https://github.com/user-attachments/assets/c8b16b74-4ecf-4e7a-9f95-1a934126b001" />
### 검색 결과
- 특허 상세 모달과 연동
- IPC 코드, 출원일, 상태 등 핵심 정보 표시
- 관심특허(즐겨찾기) 아이콘 지원

---


### 페이지네이션(Pagination)

<img width="1459" height="419" alt="image" src="https://github.com/user-attachments/assets/f360acd4-cef1-4396-aee1-6215b064bb2c" />

- 대량 검색 결과에 대응하는 페이지네이션 컴포넌트 제공
- 페이지 이동 시 스크롤 자동 초기화
- “이전 / 다음 / 페이지 번호 이동” 제공

---

### 출원일 순 정렬(Sort)

<img width="1438" height="659" alt="image" src="https://github.com/user-attachments/assets/a1e7b4f5-42b0-4cab-baad-a860ffc77b8e" />


- 출원일순으로 정렬 기능
- 오름차순 / 내림차순 정렬 가능

---

## 2.4 특허 상세 모달 (Patent Detail)

<img width="1277" height="820" alt="스크린샷 2025-11-21 120914" src="https://github.com/user-attachments/assets/b5e3aef0-0db8-4a25-b24a-b7e940ebdee0" />

- 발명명칭 / 출원번호 / 출원일 등 특허 핵심 정보 표시
- IPC 전체 분류 리스트 표시
- 초록(요약) 렌더링
- 대표 도면(image URL) 표시
- 관심특허 추가 / 삭제 기능

---

## 2.5 분석 대시보드 페이지 (Summary Dashboard)

<img width="1493" height="754" alt="스크린샷 2025-11-21 120940" src="https://github.com/user-attachments/assets/e9c75aae-b315-41bd-87cc-5821fb0abe90" />

검색된 조건을 기준으로 분석 결과를 시각화하여 제공하는 페이지입니다.

- IPC 상위 5개 분포 (Pie)
- 월별 특허 출원 추이 (Bar)
- 등록 상태 분포 (Doughnut)
- 최근 주요 특허 3건 카드형 제공
- 프리셋과 연동하여 자동 분석 실행

---

## 2.6 프리셋 관리 페이지 (Preset Management)

<img width="1571" height="620" alt="스크린샷 2025-11-21 121059" src="https://github.com/user-attachments/assets/65c26510-9f57-4fe8-b4aa-c24882ba87b4" />

- 자주 사용하는 검색 조건을 저장/편집/삭제
- 회사명 + 기간 + 상태코드 등 조건 유지
- Summary 및 Search 페이지와 자동 연동됨
- 프리셋 기반 분석 자동 실행 가능

---

## 2.7 관심특허 페이지 (Favorites)

<img width="1503" height="640" alt="스크린샷 2025-11-21 121034" src="https://github.com/user-attachments/assets/d74ef1ce-dbff-4374-a786-e81439a14308" />

- 사용자가 저장한 관심 특허 목록 관리
- 출원번호 기반 중복 방지
- 카드 UI로 주요 정보 제공
- 상세 모달과 연동하여 정확한 데이터 확인 가능

---

## 2.8 도움말 페이지 (Help)

<img width="1541" height="901" alt="스크린샷 2025-11-21 121108" src="https://github.com/user-attachments/assets/0dedf6a3-d7c3-4013-8786-1216e1841c64" />

기술/특허에 익숙하지 않은 사용자도 빠르게 이해할 수 있도록 지원하는 페이지.

- IPC 코드 상세 설명
- 특허 상태코드 안내 (공개/등록/취하/거절 등)
- 검색 가이드 및 필드 용어 설명
- 앱 사용 방법 안내

---

## 2.9 모바일 대응 (Mobile Responsive UI)

TechLens는 **모든 페이지와 핵심 기능을 모바일 환경에서도 동일한 품질로 사용할 수 있도록** 반응형 UI/UX로 설계되었습니다.

### 주요 특징
- Tailwind 기반 완전 반응형 레이아웃
- 모바일·태블릿·데스크톱 자동 최적 레이아웃 전환
- 검색 폼, 차트, 리스트, 모달 등 모든 UI 컴포넌트 대응
- 모바일에서 검색 UI 자동 접힘/펼침 처리
- 모바일 전용 상단 헤더(MobileHeader) 제공
- 페이지네이션 역시 모바일 환경에 맞게 크기와 배치 자동 조정

### 모바일 화면 예시
<img width="443" height="793" alt="스크린샷 2025-11-21 121640" src="https://github.com/user-attachments/assets/d940491d-d7fb-468f-9446-af75b731559f" />
<img width="441" height="787" alt="스크린샷 2025-11-21 121655" src="https://github.com/user-attachments/assets/26cffee8-f43e-4361-871e-1a0a6163e0d4" />
<img width="443" height="788" alt="스크린샷 2025-11-21 121714" src="https://github.com/user-attachments/assets/72fdec2a-43d6-4483-93fb-0fad98350008" />


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


