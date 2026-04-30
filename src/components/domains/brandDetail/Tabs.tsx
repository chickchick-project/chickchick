"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandDetailMap from "./map";

type Tab = "intro" | "map";

type Props = {
  images: { src: string; alt: string };
  brandName: string;
  brandDescription: string;
  brandUrl?: string;
};

export default function BrandDetailTabs({
  images,
  brandName,
  brandDescription,
  brandUrl,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  const [mapInitialized, setMapInitialized] = useState(false);
  useEffect(() => {
    if (activeTab === "map" && !mapInitialized) {
      setMapInitialized(true);
    }
  }, [activeTab, mapInitialized]);

  return (
    <div className="w-full flex flex-col h-[300px] tablet:h-[400px]">
      {/* 탭 헤더 */}
      <div className="flex-shrink-0 flex border-b px-4 tablet:px-0">
        <button
          onClick={() => setActiveTab("intro")}
          className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "intro"
              ? "border-primary-200 text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          브랜드 소개
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "map"
              ? "border-primary-200 text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          오프라인 입점처
        </button>
      </div>

      {/* 브랜드 소개 탭 */}
      <div
        className={`flex-1 min-h-0 ${activeTab === "intro" ? "flex" : "hidden"} flex-col tablet:flex-row`}
      >
        <div className="tablet:w-1/2 w-full h-full overflow-hidden">
          <Image
            src={images.src}
            alt={images.alt}
            width={600}
            height={500}
            quality={60}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAFklEQVQI12NgYGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg=="
            className="w-full h-full p-2 object-contain"
          />
        </div>
        <div className="tablet:w-1/2 w-full h-full flex flex-col justify-between px-4 py-4 gap-6 overflow-y-auto">
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {brandDescription}
          </p>
          {brandUrl && (
            <Link
              href={brandUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-3 border border-black rounded-lg text-sm font-semibold text-black hover:bg-black hover:text-primary-200 transition-colors"
            >
              공식 사이트 방문
            </Link>
          )}
        </div>
      </div>

      {/* 오프라인 입점처 탭 */}
      <div
        className={`flex-1 min-h-0 ${activeTab === "map" ? "block" : "hidden"}`}
      >
        {mapInitialized && <BrandDetailMap brandName={brandName} />}
      </div>
    </div>
  );
}
