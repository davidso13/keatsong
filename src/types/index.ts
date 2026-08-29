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
