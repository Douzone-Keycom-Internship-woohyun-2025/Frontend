# TechLens Frontend Convention

## 파일 명명 규칙

- **컴포넌트**: PascalCase (예: `PatentSearch.tsx`)
- **페이지**: PascalCase (예: `SearchPage.tsx`)
- **유틸**: camelCase (예: `formatDate.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `API_TIMEOUT`)

## 브랜치 네이밍

```
feature/기능명
fix/버그명
docs/문서명
refactor/컴포넌트명
```

## Git 커밋 메시지

### 타입

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `chore`: 빌드, 의존성 업데이트

### 형식

```
<type>: 간단한 설명

선택사항:
- 상세 설명
- 상세 설명
```

### 예시

```
feat: 로그인 페이지 구현

- 테스트 계정 로그인
- Zustand 상태 관리
- 토큰 저장
```

## PR 규칙

- PR 제목: `<type>: 설명` (커밋 메시지와 동일)
- 로컬에서 `npm run lint`, `npm run format` 실행 후 Push
- PR 본문에 변경 내용 작성

## 개발 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run format   # Prettier 포맷팅
```
