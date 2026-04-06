"use client";

import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { Store } from "@/server/hono/schemas/brand.schema";
import StorePanel from "./StorePanel";
import { useNearbyStores } from "./useNearbyStores";
import { useBrandMap } from "./useBrandMap";

interface BrandDetailMapProps {
  brandName: string;
}

export default function BrandDetailMap({ brandName }: BrandDetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { myLocation, nearbyStores, regionName, locationError, fetchMyLocation } =
    useNearbyStores(brandName);

  const { handleStoreClick } = useBrandMap({
    mapRef,
    myLocation,
    stores: nearbyStores,
    onKakaoReady: fetchMyLocation,
  });

  if (locationError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
        <MapPin className="w-10 h-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">{locationError}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* 지도 + 데스크톱 사이드 패널 */}
      <div className="flex w-full flex-1 min-h-0">
        <div ref={mapRef} className="flex-1 h-full" />
        <div className="hidden tablet:block w-[280px] flex-shrink-0 h-full border-l">
          <StorePanel
            regionName={regionName}
            stores={nearbyStores}
            onStoreClick={handleStoreClick}
            brandName={brandName}
          />
        </div>
      </div>

      {/* 모바일 토글 패널 */}
      <div className="tablet:hidden">
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setIsSheetOpen((prev) => !prev)}
            className="flex-1 py-2.5 flex items-center justify-between px-4 bg-white border rounded-lg text-sm font-medium text-gray-700"
          >
            <span>
              {regionName ? `${regionName} 근처 매장` : "근처 매장"}
              {nearbyStores && nearbyStores.length > 0 && (
                <span className="ml-1.5 text-xs font-normal text-gray-400">
                  {nearbyStores.length} 곳
                </span>
              )}
            </span>
            <span className="text-gray-400">{isSheetOpen ? "▲" : "▼"}</span>
          </button>
        </div>
        {isSheetOpen && (
          <div className="border border-t-0 rounded-b-lg overflow-hidden max-h-[300px]">
            <StorePanel
              regionName={regionName}
              stores={nearbyStores}
              onStoreClick={(store: Store) => {
                handleStoreClick(store);
                setIsSheetOpen(false);
              }}
              brandName={brandName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
