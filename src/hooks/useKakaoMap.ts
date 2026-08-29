"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_LOCATION } from "@/lib/constants";
import type { Coordinates } from "@/types";

// Kakao Maps SDK 의 최소 타입 선언 (필요한 부분만)
declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (cb: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => KakaoMap;
        Marker: new (options: { position: unknown; map?: KakaoMap }) => KakaoMarker;
      };
    };
  }
}

export interface KakaoMap {
  setCenter: (latlng: unknown) => void;
  setLevel: (level: number) => void;
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

interface UseKakaoMapOptions {
  center?: Coordinates;
  level?: number;
}

/**
 * Kakao Maps 인스턴스를 관리하는 훅.
 * - SDK 스크립트는 <KakaoMapScript> (app/layout) 에서 afterInteractive 로 로드합니다.
 * - 언마운트 시 마커/지도 참조를 정리해 메모리 누수를 방지합니다. — CLAUDE.md §5
 */
export function useKakaoMap({ center = DEFAULT_LOCATION, level = 4 }: UseKakaoMapOptions = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const kakao = window.kakao;
    const container = containerRef.current;
    if (!kakao || !container) return;

    kakao.maps.load(() => {
      const map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(center.latitude, center.longitude),
        level,
      });
      mapRef.current = map;
      setIsReady(true);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
      setIsReady(false);
    };
    // center/level 변경은 아래 별도 effect 에서 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao || !mapRef.current) return;
    mapRef.current.setCenter(new kakao.maps.LatLng(center.latitude, center.longitude));
  }, [center.latitude, center.longitude]);

  return { containerRef, mapRef, markersRef, isReady };
}
