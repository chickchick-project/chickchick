import { useCallback, useEffect, useRef } from "react";
import { MapPin, Phone } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Store } from "@/server/hono/schemas/brand.schema";

interface UseBrandMapOptions {
  mapRef: React.RefObject<HTMLDivElement | null>;
  myLocation: { x: number; y: number }[] | null;
  stores: Store[] | null;
  onKakaoReady: () => void;
}

interface UseBrandMapResult {
  handleStoreClick: (store: Store) => void;
}

export function useBrandMap({
  mapRef,
  myLocation,
  stores,
  onKakaoReady,
}: UseBrandMapOptions): UseBrandMapResult {
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<Map<string, KakaoMarker>>(new Map());
  const myLocationOverlayRef = useRef<KakaoCustomOverlay | null>(null);
  const infoWindowRef = useRef<KakaoInfoWindow | null>(null);

  const getStoreKey = (store: Store) => `${store.name}_${store.x}_${store.y}`;

  const buildInfoContent = useCallback((store: Store) => {
    const mapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(store.name)},${store.y},${store.x}`;
    return renderToStaticMarkup(
      <div className="w-[280px] p-4 flex flex-col gap-2">
        <strong className="text-sm font-semibold text-gray-900 break-keep leading-snug">
          {store.name}
        </strong>
        <span className="text-xs text-gray-500 leading-relaxed">
          {store.roadAddress || store.address}
        </span>
        {store.telephone && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Phone size={12} /> {store.telephone}
          </span>
        )}
        {store.distance && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} /> {(store.distance / 1000).toFixed(1)}km
          </span>
        )}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center justify-center w-full py-2 rounded-md bg-yellow-400 text-xs font-semibold text-gray-900"
        >
          카카오맵에서 보기
        </a>
      </div>,
    );
  }, []);

  // Kakao SDK 로드 감지 → onKakaoReady 호출
  useEffect(() => {
    const init = () => {
      const { kakao } = window;
      if (!kakao?.maps) return;
      kakao.maps.load(() => onKakaoReady());
    };

    if (window.kakao?.maps) {
      init();
    } else {
      const interval = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(interval);
          init();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [onKakaoReady]);

  // 위치 확보 시 지도 초기화
  useEffect(() => {
    if (!myLocation || myLocation.length === 0 || !mapRef.current) return;

    const { kakao } = window;
    if (!kakao?.maps) return;

    const { x, y } = myLocation[0];
    const center = new kakao.maps.LatLng(y, x);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });
      kakao.maps.event.addListener(mapInstanceRef.current, "click", () => {
        infoWindowRef.current?.close();
      });
    } else {
      mapInstanceRef.current.setCenter(center);
    }
  }, [myLocation, mapRef]);

  // 매장 목록 변경 시 마커 갱신
  useEffect(() => {
    if (!stores || !mapInstanceRef.current) return;

    const { kakao } = window;
    if (!kakao?.maps) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();
    myLocationOverlayRef.current?.setMap(null);
    myLocationOverlayRef.current = null;

    if (!infoWindowRef.current) {
      infoWindowRef.current = new kakao.maps.InfoWindow({ removable: true });
    }

    const first = stores[0];
    if (first) {
      mapInstanceRef.current.setCenter(
        new kakao.maps.LatLng(Number(first.y), Number(first.x)),
      );
    }

    if (stores.length === 0) {
      myLocationOverlayRef.current = new kakao.maps.CustomOverlay({
        position: mapInstanceRef.current.getCenter(),
        map: mapInstanceRef.current,
        content: `<div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:12px 16px;font-size:13px;color:#555;box-shadow:0 2px 6px rgba(0,0,0,0.15);">근처에 매장이 없습니다.</div>`,
        zIndex: 5,
      });
      return;
    }

    stores.forEach((store) => {
      const position = new kakao.maps.LatLng(Number(store.y), Number(store.x));
      const marker = new kakao.maps.Marker({
        position,
        map: mapInstanceRef.current!,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        infoWindowRef.current!.setContent(buildInfoContent(store));
        infoWindowRef.current!.open(mapInstanceRef.current!, marker);
      });

      markersRef.current.set(getStoreKey(store), marker);
    });
  }, [stores, buildInfoContent]);

  const handleStoreClick = useCallback(
    (store: Store) => {
      const { kakao } = window;
      if (!kakao?.maps || !mapInstanceRef.current) return;

      const position = new kakao.maps.LatLng(Number(store.y), Number(store.x));
      mapInstanceRef.current.setCenter(position);

      const marker = markersRef.current.get(getStoreKey(store));
      if (marker && infoWindowRef.current) {
        infoWindowRef.current.setContent(buildInfoContent(store));
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    },
    [buildInfoContent],
  );

  return { handleStoreClick };
}
