"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";
import { useParams } from "next/navigation";

export interface Store {
  name: string;
  address: string;
  roadAddress?: string;
  telephone?: string;
  x: string;
  y: string;
  category?: string;
  link?: string;
  distance?: number;
}

export const BrandMap = () => {
  const params = useParams();
  const brandName = params.name?.toString();
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 위치 가져오기
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
        setUserLocation({ lat: 37.5665, lng: 126.978 });
        setIsLoading(false);
      }
    );
  };

  // 백엔드 API를 통한 장소 검색
  const searchStores = async () => {
    if (!userLocation) return;

    try {
      const params = new URLSearchParams({
        query: brandName ?? "",
        x: userLocation.lng.toString(),
        y: userLocation.lat.toString(),
      });

      const response = await fetch(`/api/brands/${brandName}?${params}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setStores(data.stores || []);

      if (data.stores && data.stores.length > 0) {
        addMarkers(data.stores);
      }
    } catch (error) {
      console.error("검색 중 오류:", error);
      setStores([]);
    }
  };

  // 거리 계산 함수 (클라이언트 사이드)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 마커 추가
  const addMarkers = (storeList: Store[]) => {
    if (!mapRef.current || !window.naver) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 사용자 위치 마커
    if (userLocation) {
      const userMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
        map: mapRef.current,
        title: "내 위치",
        icon: {
          content: `
            <div style="
              width: 24px;
              height: 24px;
              background: #4285F4;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
            "></div>
            <style>
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
                100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
              }
            </style>
          `,
          anchor: new naver.maps.Point(12, 12),
        },
      });
      markersRef.current.push(userMarker);
    }

    // 매장 마커
    storeList.forEach((store, index) => {
      // 네이버 지도 좌표 변환 (EPSG:4326)
      const lat = store.y ? parseInt(store.y) / 10000000 : 0;
      const lng = store.x ? parseInt(store.x) / 10000000 : 0;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current ?? undefined,
        title: store.name,
        icon: {
          content: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              background: #000;
              color: white;
              border-radius: 50%;
              font-size: 14px;
              font-weight: bold;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
            ">${index + 1}</div>
          `,
          anchor: new naver.maps.Point(15, 15),
        },
      });

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(marker, "click", () => {
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, lat, lng)
          : null;

        const content = `
          <div style="padding: 15px; max-width: 300px;">
            <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">
              ${store.name}
            </h4>
            ${
              store.category
                ? `
              <p style="margin: 4px 0; color: #999; font-size: 12px;">
                ${store.category}
              </p>
            `
                : ""
            }
            <p style="margin: 6px 0; color: #666; font-size: 14px;">
              📍 ${store.roadAddress || store.address}
            </p>
            ${
              store.telephone
                ? `
              <p style="margin: 6px 0; color: #666; font-size: 14px;">
                📞 <a href="tel:${store.telephone}" style="color: #0066cc; text-decoration: none;">
                  ${store.telephone}
                </a>
              </p>
            `
                : ""
            }
            ${
              distance !== null
                ? `
              <p style="margin: 6px 0; color: #666; font-size: 14px;">
                🚶 약 ${distance.toFixed(1)}km
              </p>
            `
                : ""
            }
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapRef.current!, marker);
        }

        mapRef.current?.panTo(marker.getPosition());
      });

      markersRef.current.push(marker);
    });

    // 지도 범위 조정
    if (storeList.length > 0 && userLocation) {
      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(userLocation.lat, userLocation.lng),
        new naver.maps.LatLng(userLocation.lat, userLocation.lng)
      );

      storeList.forEach((store) => {
        const lat = parseInt(store.y) / 10000000;
        const lng = parseInt(store.x) / 10000000;
        bounds.extend(new naver.maps.LatLng(lat, lng));
      });

      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  };

  // 지도 초기화
  const initializeMap = () => {
    if (!window.naver || mapRef.current || !userLocation) return;

    const mapOptions = {
      center: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
      zoom: 14,
    };

    mapRef.current = new naver.maps.Map("naver-map", mapOptions);

    // InfoWindow 초기화
    infoWindowRef.current = new naver.maps.InfoWindow({
      content: "",
      borderWidth: 0,
      backgroundColor: "white",
      anchorSize: new naver.maps.Size(10, 10),
      anchorSkew: false,
      anchorColor: "white",
      pixelOffset: new naver.maps.Point(0, -10),
    });

    // 지도 준비되면 매장 검색
    searchStores();
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && window.naver) {
      initializeMap();
    }
  }, [userLocation]);

  return (
    <div className="w-full pt-10">
      <h3 className="text-lg font-semibold mb-3">매장 정보</h3>
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
          위치 정보를 가져오는 중...
        </div>
      )}

      {/* 지도 */}
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={initializeMap}
      />
      <div
        id="naver-map"
        style={{ width: "100%", height: "300px" }}
        className="rounded-xl shadow-lg"
      />

      {/* 검색 결과 */}
      {stores.length > 0 && (
        <div className="mt-6">
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {stores.map((store, index) => {
              const lat = parseInt(store.y) / 10000000;
              const lng = parseInt(store.x) / 10000000;
              const distance = userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    lat,
                    lng
                  )
                : null;

              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:border-black hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    if (mapRef.current) {
                      const position = new naver.maps.LatLng(lat, lng);
                      mapRef.current.panTo(position);
                      mapRef.current.setZoom(17);

                      // 해당 마커 클릭 이벤트 트리거
                      const marker = markersRef.current[index + 1]; // +1은 사용자 위치 마커
                      if (marker) {
                        naver.maps.Event.trigger(marker, "click");
                      }
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {store.name}
                        </h4>
                        {store.category && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {store.category}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {store.roadAddress || store.address}
                        </p>
                        {store.telephone && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            📞 {store.telephone}
                          </p>
                        )}
                      </div>
                    </div>
                    {distance !== null && (
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {distance.toFixed(1)}km
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
