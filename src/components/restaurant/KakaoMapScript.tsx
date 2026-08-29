"use client";

import Script from "next/script";

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

/**
 * Kakao Maps SDK 로더.
 * <Script strategy="afterInteractive"> 로 비동기 로드합니다. — CLAUDE.md §5
 * 루트 레이아웃에 한 번만 배치하세요.
 */
export function KakaoMapScript() {
  if (!APP_KEY) return null;

  return (
    <Script
      src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=services,clusterer`}
      strategy="afterInteractive"
    />
  );
}
