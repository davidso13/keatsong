"use client";

import { useEffect } from "react";
import { MapPin } from "lucide-react";
import { useKakaoMap } from "@/hooks/useKakaoMap";
import { DEFAULT_LOCATION } from "@/lib/constants";
import type { Coordinates } from "@/types";

interface MapMarker extends Coordinates {
  id: string;
  label?: string;
}

interface MapViewProps {
  center?: Coordinates;
  markers?: MapMarker[];
  level?: number;
  className?: string;
}

/**
 * Kakao map viewer.
 * - Shows a placeholder when the SDK is not configured (no NEXT_PUBLIC_KAKAO_MAP_APP_KEY).
 * - The useKakaoMap hook handles marker/listener cleanup on unmount.
 */
export function MapView({
  center = DEFAULT_LOCATION,
  markers = [],
  level = 5,
  className = "h-72 w-full",
}: MapViewProps) {
  const hasSdk = Boolean(process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY);
  const { containerRef, mapRef, markersRef, isReady } = useKakaoMap({ center, level });

  useEffect(() => {
    const kakao = window.kakao;
    if (!isReady || !kakao || !mapRef.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = markers.map((marker) => {
      const position = new kakao.maps.LatLng(marker.latitude, marker.longitude);
      return new kakao.maps.Marker({ position, map: mapRef.current! });
    });

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [isReady, markers, mapRef, markersRef]);

  if (!hasSdk) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/20 bg-ink/[0.03] text-sm text-ink-faint ${className}`}
      >
        <MapPin className="h-6 w-6" aria-hidden />
        <p>Map preview</p>
        <p className="text-xs">Set NEXT_PUBLIC_KAKAO_MAP_APP_KEY in .env to enable the map.</p>
      </div>
    );
  }

  return <div ref={containerRef} className={`overflow-hidden rounded-2xl ${className}`} />;
}
