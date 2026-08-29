import type { Coordinates } from "@/types";

/**
 * 두 좌표(WGS84) 사이의 거리를 미터 단위로 계산 (Haversine).
 */
export function getDistanceInMeters(a: Coordinates, b: Coordinates): number {
  const R = 6_371_000; // 지구 반지름(m)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}
