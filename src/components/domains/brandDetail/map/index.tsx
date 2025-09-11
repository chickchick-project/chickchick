"use client";

import { useRef } from "react";
import Script from "next/script";

export const BrandMap = () => {
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = () => {
    if (!window.naver || mapRef.current) return;
    mapRef.current = new window.naver.maps.Map("naver-map", {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 15,
    });
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={initializeMap}
      />
      <div
        id="naver-map"
        style={{ width: "100%", height: "400px" }}
        className="rounded-xl"
      />
    </>
  );
};
