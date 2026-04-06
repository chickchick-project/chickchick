import { Phone, MapPin } from "lucide-react";
import type { Store } from "@/server/hono/schemas/brand.schema";

interface StorePanelProps {
  regionName: string | null;
  stores: Store[] | null;
  onStoreClick: (store: Store) => void;
  brandName: string;
}

export default function StorePanel({
  regionName,
  stores,
  onStoreClick,
  brandName,
}: StorePanelProps) {
  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden">
      {/* 타이틀 */}
      <div className="px-4 py-3 border-b">
        <p className="text-xs text-gray-400">현재 위치 기준</p>
        <h3 className="text-sm font-semibold text-gray-900 mt-0.5">
          {regionName ? `${regionName} 근처 매장` : "근처 매장"}
          {stores && stores.length > 0 && (
            <span className="ml-1.5 text-xs font-normal text-gray-400">
              {stores.length}곳
            </span>
          )}
        </h3>
      </div>

      {/* 매장 목록 */}
      <div className="flex-1 overflow-y-auto">
        {stores === null ? (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">
            위치 정보를 불러오는 중...
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
            <p className="text-xs text-gray-400">근처에 매장이 없습니다.</p>
            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(brandName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#FEE500] rounded-md text-xs font-semibold text-[#3C1E1E]"
            >
              다른 지역 찾아보기
            </a>
          </div>
        ) : (
          <ul>
            {stores.map((store, i) => (
              <li
                key={i}
                onClick={() => onStoreClick(store)}
                className="px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 break-keep leading-snug">
                  {store.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {store.roadAddress || store.address}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {store.telephone && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="w-3 h-3" /> {store.telephone}
                    </span>
                  )}
                  {store.distance && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />{" "}
                      {(store.distance / 1000).toFixed(1)}km
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
