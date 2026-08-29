"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LOCATION } from "@/lib/constants";
import type { Coordinates } from "@/types";

interface GeolocationState {
  coords: Coordinates;
  /** 브라우저 위치 권한을 실제로 얻었는지 여부 */
  isPrecise: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * 사용자 현재 위치를 가져옵니다.
 * 실패 시 기본 위치(강남역)로 Fallback 합니다. — CLAUDE.md §5
 */
export function useGeolocation(auto = true): GeolocationState & { request: () => void } {
  const [state, setState] = useState<GeolocationState>({
    coords: DEFAULT_LOCATION,
    isPrecise: false,
    isLoading: auto,
    error: null,
  });
  // request() 호출마다 증가시켜 아래 effect 를 재실행합니다. 0 이면 아직 요청 안 함.
  const [requestCount, setRequestCount] = useState(auto ? 1 : 0);

  const request = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    setRequestCount((n) => n + 1);
  }, []);

  useEffect(() => {
    if (requestCount === 0) return;

    let cancelled = false;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      queueMicrotask(() => {
        if (cancelled) return;
        setState({
          coords: DEFAULT_LOCATION,
          isPrecise: false,
          isLoading: false,
          error: "위치 정보를 지원하지 않는 환경입니다.",
        });
      });
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isPrecise: true,
          isLoading: false,
          error: null,
        });
      },
      (err) => {
        if (cancelled) return;
        setState({
          coords: DEFAULT_LOCATION,
          isPrecise: false,
          isLoading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );

    return () => {
      cancelled = true;
    };
  }, [requestCount]);

  return { ...state, request };
}
