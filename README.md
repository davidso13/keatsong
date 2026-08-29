# TastyMap 🍜

위치 기반 맛집 탐방 & 테마별 큐레이션 웹 플랫폼.

## 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · TanStack Query · Zustand · Prisma · NextAuth v5 · Zod · Kakao Maps SDK

## 빠른 시작

```bash
pnpm install
cp .env.example .env      # 값 채우기 (없어도 목업 데이터로 실행됨)
pnpm dev                  # http://localhost:3000
```

`DATABASE_URL` 을 비워두면 `src/data/*.json` 파일의 데이터로 즉시 동작합니다.
맛집 데이터를 넣는 방법은 [src/data/README.md](./src/data/README.md) 참고.

## 데이터베이스 연결 (선택)

```bash
# .env 의 DATABASE_URL 에 PostgreSQL 접속 정보 입력 후
pnpm prisma:migrate       # 스키마 마이그레이션
pnpm db:seed              # 샘플 데이터 삽입
pnpm prisma:studio        # 데이터 브라우저
```

## 주요 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | ESLint |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm prisma:migrate` | DB 마이그레이션 |
| `pnpm db:seed` | 시드 데이터 |

## 디렉터리

```
src/
├── app/
│   ├── (main)/        # 홈 / 맛집 탐색 / 큐레이션
│   ├── (auth)/        # 로그인 / 회원가입
│   └── api/           # Route Handlers (표준 ApiResponse 규격)
├── components/
│   ├── ui/            # Button, Input, Badge, Card ...
│   ├── common/        # Header, Footer, Navigation
│   └── restaurant/    # RestaurantCard, MapView, ReviewList, RestaurantFilters ...
├── data/             # ★ 맛집/리뷰/큐레이션 데이터 (JSON). 여기를 편집하세요
├── hooks/             # useDebounce, useGeolocation, useKakaoMap
├── lib/               # prisma, auth, utils, constants, schemas
├── services/          # 서버 데이터 접근 계층 (DB ↔ JSON 자동 전환)
├── types/             # 도메인 타입 & API 응답 타입
└── utils/             # format, geo (Haversine 거리 계산)
```

자세한 규칙은 [CLAUDE.md](./CLAUDE.md) 참고.
