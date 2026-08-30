// 전역 도메인 타입 정의
// Prisma 모델과 형태를 맞추되, 클라이언트 컴포넌트에서도 안전하게 쓸 수 있도록 별도 정의합니다.

export type FoodCategory =
  | "KOREAN"
  | "JAPANESE"
  | "CHINESE"
  | "WESTERN"
  | "ASIAN"
  | "CAFE"
  | "BAR"
  | "DESSERT"
  | "ETC";

export type PriceRange =
  | "UNDER_10"
  | "USD_10_20"
  | "USD_20_30"
  | "USD_30_50"
  | "USD_50_70"
  | "USD_70_100"
  | "OVER_100";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NearestStation {
  /** 역 이름. 예: "강남역" */
  name: string;
  /** 호선. 예: "2호선", "수인분당선" */
  line: string | null;
  /** 출구. 예: "5번 출구" */
  exit: string | null;
  /** 도보 소요 시간(분) */
  walkMinutes: number | null;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: FoodCategory;
  priceRange: PriceRange;
  address: string;
  region: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  thumbnail: string | null;
  images: string[];
  hasParking: boolean;
  hasBreakTime: boolean;
  openingHours: Record<string, string> | null;
  /** 근처 지하철역 정보 */
  nearestStation: NearestStation | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  images: string[];
  restaurantId: string;
  author: ReviewAuthor;
  createdAt: string;
}

export interface RestaurantWithReviews extends Restaurant {
  reviews: Review[];
  /** 요청한 사용자 위치 기준 거리(m). 위치 정보가 없으면 null */
  distance?: number | null;
}

export interface CuratedListItem {
  id: string;
  order: number;
  comment: string | null;
  restaurant: Restaurant;
}

export interface CuratedList {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  theme: string;
  itemCount: number;
  createdAt: string;
}

export interface CuratedListDetail extends CuratedList {
  items: CuratedListItem[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
}

/** 홈 상단 롤링 배너 (src/data/banners.json 로 관리) */
export interface Banner {
  /** 배너 이미지: 절대 URL 또는 public/ 기준 경로 */
  image: string;
  /** 클릭 시 이동할 랜딩 URL (내부 경로 "/..." 또는 외부 "https://...") */
  href: string;
  /** 배너 제목 (이미지 위 오버레이 + 대체 텍스트) */
  title: string;
  /** 부제 (선택) */
  subtitle: string | null;
}

/** Things to do — 페스티벌 / 체험 / 액티비티 */
export interface Activity {
  id: string;
  name: string;
  description: string;
  /** 분류 라벨. 예: "Festival", "Workshop", "Tour" */
  category: string;
  region: string;
  /** 자유 형식 일정 문구. 예: "May 3–5, 2026" 또는 "Year-round" */
  schedule: string;
  /** 입장료/참가비 문구. 예: "Free", "From $20" */
  price: string | null;
  thumbnail: string | null;
  images: string[];
  /** 외부 예약/공식 링크 (선택) */
  link: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

/** Places — 방문해볼 만한 장소 */
export interface Place {
  id: string;
  name: string;
  description: string;
  /** 분류 라벨. 예: "Landmark", "Park", "Museum", "Neighbourhood" */
  category: string;
  region: string;
  address: string | null;
  /** 추천 방문 시간대/팁 (선택) */
  bestTime: string | null;
  thumbnail: string | null;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

/** Share moments — 게시판 댓글 */
export interface PostComment {
  id: string;
  postId: string;
  nickname: string;
  body: string;
  createdAt: string;
}

/** Share moments — 게시글 */
export interface Post {
  id: string;
  nickname: string;
  title: string;
  body: string;
  commentCount: number;
  createdAt: string;
}

export interface PostDetail extends Post {
  comments: PostComment[];
}
