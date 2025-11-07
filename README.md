# TechLens Frontend

특허 검색 및 분석 플랫폼의 **프론트엔드** 저장소입니다. React + TypeScript 기반으로 특허 검색, 분석, 관심특허 관리 기능을 제공합니다.


## 📋 프로젝트 개요

### 프로젝트 정보

- **프로젝트명**: TechLens (특허 검색 및 분석 플랫폼)
- **소속**: 더존 ICT Group x 강원대학교 컴퓨터공학과 심우현

### 전체 아키텍처

```
TechLens 프로젝트
├── techlens-backend (별도 레포)    ← 백엔드
│   ├── Node.js + Express
│   ├── KIPRIS API 연동
│   └── MySQL 데이터베이스
│
└── techlens-frontend (이 저장소)   ← 프론트엔드
    ├── React + TypeScript
    ├── Vite 빌드 도구
    └── Vercel 배포
```

## 🚀 주요 기능

- **특허 검색**: 회사명, 기간별로 특허 검색하고 상세 정보 확인
- **검색 프리셋**: 자주 사용하는 검색 조건을 저장하고 재사용
- **분석 요약**: IPC 분류별 분포, 월별 추이, 상태별 통계를 시각화
- **관심특허 관리**: 주요 특허를 관심목록에 저장하여 추적

## 🛠 기술 스택

| 항목                | 기술                       |
| ------------------- | -------------------------- |
| **프레임워크**      | React 18 + TypeScript      |
| **빌드 도구**       | Vite                       |
| **상태 관리**       | Zustand                    |
| **라우팅**          | React Router DOM v6        |
| **HTTP 클라이언트** | Axios                      |
| **스타일링**        | Tailwind CSS               |
| **차트 시각화**     | Chart.js + react-chartjs-2 |
| **배포**            | Vercel                     |

## 📁 프로젝트 구조

```
src/
├── api/                      # 백엔드 API 통신
│   ├── client.ts             # Axios 인스턴스
│   └── services/             # 특허, 분석, 프리셋 등 서비스 API
│
├── components/
│   ├── common/               # 공통 컴포넌트 (로딩, 에러, NoData 등)
│   ├── Patent/               # 특허 관련 컴포넌트
│   ├── Summary/             # 요약 분석 대시보드
│   └── Layout/               # ProtectedLayout, Header 등
|   └── Preset/               # 프리셋 관련 컴포넌트
|   └── Sidebar/               # 사이드바 컴포넌트
|   └── PatentSearch/          # 특허검색 관련 컴포넌트
|   └── ProtectedRoute/        # 사이드바 레이아웃 컴포넌트
│
├── hooks/
│   ├── usePresets.ts         # 검색 프리셋 관리 훅
│   ├── useFavorites.ts       # 관심특허 관리 훅
│   └── useSummaryAnalysis.ts # 요약분석 데이터 훅
│   └── usePatentSearch.ts    # 특허검색 데이터 훅
│
├── pages/
│   ├── PatentSearchPage.tsx        # 검색 및 프리셋
│   ├── SummaryPage.tsx       # 요약분석 및 프리셋셋
│   ├── FavoritesPage.tsx     # 관심특허
│   ├── HomePage.tsx          # 메인
│   └── HelpPage.tsx          # 도움말
│   └── LoginPage.tsx         # 로그인
│   └── PresetManagementPage.tsx     #프리셋 관리
│
├── store/                    # Zustand 전역상태
│   ├── uiStore.ts
│   └── userStore.ts
│
├── types/
│   ├── patent.ts             # 특허 타입
│   ├── summary.ts            # 분석 타입
│   └── preset.ts             # 프리셋 타입
│
├── utils/
│   ├── dateFormat.ts
│   ├── statusColor.ts
│   └── statusLabel.ts
│
├── App.tsx
└── main.tsx

```


## 🔗 백엔드 API

### 주요 엔드포인트

**인증:**

- `POST /users/login` - 로그인

**특허 검색:**

- `GET /patents/search?type=basic` - 기본 검색
- `GET /patents/search?type=advanced` - 고급 검색
- `GET /patents/:applicationNumber` - 특허 상세정보

**분석:**

- `GET /analysis/summary` - 분석 요약 (차트 데이터)

**프리셋:**

- `GET /presets` - 프리셋 목록
- `POST /presets` - 프리셋 생성
- `PUT /presets/:presetId` - 프리셋 수정
- `DELETE /presets/:presetId` - 프리셋 삭제

**관심특허:**

- `GET /favorites` - 관심특허 목록
- `POST /favorites` - 관심특허 추가
- `DELETE /favorites/:applicationNumber` - 관심특허 삭제

> 상세한 API 명세는 백엔드 레포지토리 참고
> (https://github.com/Douzone-Keycom-Internship-woohyun-2025/Docs/blob/main/specs/TechLens_API_specificationsV1.0.md)

## 👨‍💻 개발 가이드

### 커밋 컨벤션

```
feat:     새로운 기능
fix:      버그 수정
docs:     문서 변경
refactor: 코드 리팩토링
perf:     성능 개선
```

### 브랜치 전략

```
main           → 프로덕션
└── develop    → 개발 통합
    ├── feature/auth
    ├── feature/search
    ├── feature/analysis
    ├── feature/favorites
    └── feature/presets
```

### 코드 스타일

```bash
npm run lint      # ESLint 검사
npm run format    # Prettier 포맷팅
```

자세한 규칙은 [CONVENTION.md](./CONVENTION.md) 참고

## 🚢 배포

### Vercel 자동 배포

프로젝트는 GitHub 연동으로 자동 배포됩니다.

- **Staging**: develop 브랜치 변경 시
- **Production**: main 브랜치 변경 시

**배포 URL**: [https://techlens-frontend.vercel.app](https://frontend-woohyun-sims-projects.vercel.app/)
---

## 📦 설치 및 실행

### 사전 요구사항

```
Node.js 20.11.1
npm 또는 yarn
```

### 1단계: 저장소 클론

```bash
git clone https://github.com/YOUR_ORG/techlens-frontend.git
cd techlens-frontend
```

### 2단계: 의존성 설치

```bash
npm ci
```

### 3단계: 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 내용:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
npm run preview
```
---
### 환경 변수 (Vercel)

```
VITE_API_URL=https://api.example.com/api/v1
VITE_API_TIMEOUT=10000
```

## 📊 구현 현황

| 기능          | 상태 |
| ------------- | ---- |
| 로그인        | 🔄   |
| 특허 검색     | 🔄   |
| 분석 대시보드 | 🔄   |
| 관심특허 관리 | 🔄   |
| 프리셋 기능   | 🔄   |

## 🔗 관련 저장소

- **백엔드**: https://github.com/Douzone-Keycom-Internship-woohyun-2025/Backend

---

**마지막 업데이트**: 2025년 11월




