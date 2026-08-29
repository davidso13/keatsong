# Project Overview: 맛집 탐방 & 큐레이션 웹 플랫폼 (TastyMap)

사용자가 위치 기반으로 맛집을 탐색하고, 테마별 큐레이션 리스트와 리뷰를 확인할 수 있는 반응형 웹 애플리케이션입니다.

---

## 1. Tech Stack & Tools
- **Framework**: Next.js 14+ (App Router) / React 18+ / TypeScript 5+
- **Styling**: Tailwind CSS / shadcn/ui / Lucide React
- **State Management**: TanStack Query (React Query v5) / Zustand
- **Database & ORM**: PostgreSQL / Prisma
- **Maps API**: Kakao Maps SDK (또는 Naver Cloud Platform Maps)
- **Authentication**: NextAuth.js (Auth.js v5)
- **Validation**: Zod (요청 데이터 및 폼 유효성 검증)
- **Package Manager**: pnpm (또는 npm)

---

## 2. Directory Structure & Architecture
```text
src/
├── app/                  # Next.js App Router (Page & Route Handlers)
│   ├── (auth)/           # 로그인, 회원가입 관련 라우트 그룹
│   ├── (main)/           # 메인 피드, 맛집 탐색, 상세 페이지 라우트 그룹
│   │   ├── restaurants/  # 맛집 목록 (/restaurants) 및 상세 (/restaurants/[id])
│   │   └── curated/      # 테마별 맛집 큐레이션 컬렉션
│   └── api/              # 백엔드 API 엔드포인트
├── components/           # UI 컴포넌트
│   ├── ui/               # shadcn/ui 기반 원자 단위 컴포넌트 (Button, Input 등)
│   ├── common/           # Header, Footer, Navigation, Modal 등 공통 컴포넌트
│   └── restaurant/       # 맛집 카드, 지도 뷰어, 리뷰 리스트, 평점 배지 등
├── hooks/                # 커스텀 훅 (useKakaoMap, useGeolocation, useDebounce 등)
├── lib/                  # 외부 라이브러리 및 클라이언트 설정 (prisma.ts, auth.ts)
├── services/             # 비즈니스 로직 및 외부/내부 API 호출 함수
├── types/                # TypeScript 인터페이스, DTO, 전역 타입 정의
└── utils/                # 포맷터(가격, 거리, 날짜), 유틸리티 함수
```

---

## 3. Core Development Commands
- `pnpm dev` : 로컬 개발 서버 실행 (`http://localhost:9716`)
- `pnpm build` : 프로덕션 빌드
- `pnpm lint` : ESLint 문법 및 코드 스타일 검사
- `pnpm type-check` : TypeScript 타입 체크 (`tsc --noEmit`)
- `pnpm prisma:migrate` : DB 마이그레이션 적용 (`npx prisma migrate dev`)
- `pnpm prisma:studio` : Prisma DB 시각화 브라우저 열기

---

## 4. Coding Standards & Conventions

### 4.1. TypeScript & Code Style
- `any` 타입 사용은 엄격히 금지하며, 인터페이스/타입 정의를 필수로 작성합니다.
- API 요청/응답 및 폼 검증에는 `Zod` 스키마를 정의하고 이를 기반으로 타입을 추론(`z.infer<typeof schema>`)하여 사용합니다.
- 파일명 규칙:
  - 컴포넌트 파일: PascalCase (`RestaurantCard.tsx`, `MapContainer.tsx`)
  - 훅/유틸/서비스 파일: camelCase (`useGeolocation.ts`, `formatDistance.ts`)
  - API 라우트: `route.ts`, 페이지: `page.tsx`, 레이아웃: `layout.tsx`

### 4.2. Next.js & React Rules
- 기본적으로 **Server Component**를 우선 사용합니다.
- 지도 렌더링, 사용자 입력, 브라우저 API(Geolocation 등), React Hooks가 필요한 영역만 별도 컴포넌트로 분리하여 `'use client'`를 선언합니다.
- 이미지는 반드시 `next/image`를 사용하며, 외부 이미지 호스팅 도메인은 `next.config.js`의 `images.remotePatterns`에 등록합니다.

### 4.3. API & Error Handling
- 모든 Route Handler는 표준 응답 형식을 반환해야 합니다:
  ```typescript
  type ApiResponse<T> = 
    | { success: true; data: T; message?: string }
    | { success: false; error: { code: string; message: string } };
  ```
- 클라이언트 에러는 Toast 메시지로 사용자에게 알리고, 서버 에러는 적절한 HTTP 상태 코드(400, 401, 403, 404, 500)를 반환합니다.

---

## 5. Domain Rules (Restaurant & Discovery)
- **위치 및 좌표계**:
  - 데이터베이스 좌표는 WGS84 기준 `latitude`(위도), `longitude`(경도)를 저장합니다.
  - 사용자의 현재 위치를 가져오지 못한 경우 기본 위치(예: 서울 강남역 또는 시청 중심 좌표)로 Fallback 처리합니다.
- **지도 연동**:
  - 지도 SDK Script는 Next.js `<Script>` 컴포넌트를 사용해 `strategy="afterInteractive"`로 비동기 로드합니다.
  - 지도 컴포넌트가 언마운트될 때 이벤트 리스너와 마커 객체를 정리(cleanup)하여 메모리 누수를 방지합니다.
- **필터링 & 검색**:
  - 필터 항목: 음식 카테고리(한식, 일식, 양식, 카페 등), 지역(시/구/동), 가격대(1만 원 이하, 1~3만 원 등), 주차 여부, 브레이크타임 여부.
  - 검색어 입력은 300ms 디바운스(Debounce)를 적용하여 불필요한 API 요청을 방지합니다.

---

## 6. Workflow Guidelines for Claude Code
1. 새 컴포넌트나 API를 개발하기 전, 먼저 관련된 타입(`src/types/`)과 기존 컴포넌트가 있는지 확인하세요.
2. 기능 추가나 코드 리팩토링 후에는 반드시 `pnpm type-check` 및 `pnpm lint`를 실행해 에러가 없는지 검증하세요.
3. 지도가 포함된 페이지에서는 불필요한 전체 페이지 리렌더링이 발생하지 않도록 지도 영역의 상태 관리를 격리하세요.
