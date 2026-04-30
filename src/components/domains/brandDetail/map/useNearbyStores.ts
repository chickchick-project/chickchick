import { useState, useEffect, useCallback } from "react";
import { brandApi } from "@/client/utils/api/brands.api";
import type { Store } from "@/server/hono/schemas/brand.schema";

type MyLocation = {
  x: number;
  y: number;
  address_name: string;
  region_3depth_name: string;
};

interface UseNearbyStoresResult {
  myLocation: MyLocation[] | null;
  nearbyStores: Store[] | null;
  regionName: string | null;
  locationError: string | null;
  fetchMyLocation: () => void;
}

export function useNearbyStores(brandName: string): UseNearbyStoresResult {
  const [myLocation, setMyLocation] = useState<MyLocation[] | null>(null);
  const [nearbyStores, setNearbyStores] = useState<Store[] | null>(null);
  const [regionName, setRegionName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchMyLocation = useCallback(() => {
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        brandApi
          .getRegion(longitude, latitude)
          .then((data) => setMyLocation(data?.region ?? null))
          .catch(() => setLocationError("위치 정보를 불러오지 못했습니다."));
      },
      () =>
        setLocationError(
          "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.",
        ),
    );
  }, []);

  useEffect(() => {
    if (!myLocation || myLocation.length === 0) return;

    const { x, y, region_3depth_name } = myLocation[0];
    setRegionName(region_3depth_name);

    brandApi
      .getStores(brandName, x, y)
      .then((data) => setNearbyStores(data?.stores ?? []))
      .catch(() => {});
  }, [myLocation, brandName]);

  return { myLocation, nearbyStores, regionName, locationError, fetchMyLocation };
}
