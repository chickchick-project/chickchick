import { prisma } from "@/server/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import {
  ApiBrandDetailResponse,
  ApiBrandSimpleResponse,
  Store,
} from "../schemas/brand.schema";
import { brandDetailSelect, parseMapLocation } from "../repositories/brand.repository";

interface NaverLocalItem {
  title: string;
  address: string;
  roadAddress: string;
  telephone: string;
  mapx: string;
  mapy: string;
  category: string;
  link: string;
}

/**
 * 모든 브랜드 목록 조회
 * - 브랜드 필터링, 검색 등에 사용
 * @returns 모든 브랜드의 간단 응답 목록을 담은 ServiceResult
 */
export async function getAllBrandsService(): Promise<
  ServiceResult<ApiBrandSimpleResponse[]>
> {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        nameEn: true,
        nameKo: true,
      },
      orderBy: {
        nameKo: "asc",
      },
    });

    const transformed = brands.map((brand) => ({
      id: brand.id,
      nameEn: brand.nameEn,
      nameKo: brand.nameKo ?? brand.nameEn,
    }));

    return serviceSuccess(transformed);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 브랜드 ID로 상세 조회
 * @param brandId 조회할 브랜드 ID
 * @returns 브랜드 상세 정보를 담은 ServiceResult
 */
export async function getBrandByIdService(
  brandId: string
): Promise<ServiceResult<ApiBrandDetailResponse>> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: brandDetailSelect,
    });

    if (!brand) {
      return serviceNotFound("브랜드를 찾을 수 없습니다.");
    }

    // Prisma 타입을 API 타입으로 변환
    const transformed: ApiBrandDetailResponse = {
      id: brand.id,
      nameEn: brand.nameEn,
      nameKo: brand.nameKo ?? brand.nameEn,
      description: brand.description,
      imageUrl: brand.imageUrl,
      brandUrl: brand.brandUrl,
      mapLocation: parseMapLocation(brand.mapLocation),
    };

    return serviceSuccess(transformed);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 브랜드 한글 이름으로 상세 조회
 * - brand/[name] 페이지에서 사용
 * @param nameKo 조회할 브랜드의 한글 이름
 * @returns 브랜드 상세 정보를 담은 ServiceResult
 */
export async function getBrandByNameService(
  nameKo: string
): Promise<ServiceResult<ApiBrandDetailResponse>> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { nameKo },
      select: brandDetailSelect,
    });

    if (!brand) {
      return serviceNotFound("브랜드를 찾을 수 없습니다.");
    }

    // Prisma 타입을 API 타입으로 변환
    const transformed: ApiBrandDetailResponse = {
      id: brand.id,
      nameEn: brand.nameEn,
      nameKo: brand.nameKo ?? brand.nameEn,
      description: brand.description,
      imageUrl: brand.imageUrl,
      brandUrl: brand.brandUrl,
      mapLocation: parseMapLocation(brand.mapLocation),
    };

    return serviceSuccess(transformed);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 네이버 지역 검색 API를 통해 브랜드 매장 목록 조회
 * @param name 검색할 브랜드 이름
 * @param coords 사용자 위치 좌표 (거리순 정렬에 사용)
 */
export async function getStoresByNameService(
  name: string,
  coords?: { x: string; y: string }
): Promise<ServiceResult<{ stores: Store[]; total: number }>> {
  try {
    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      return serviceInternalError(
        new Error("Naver API credentials are missing")
      );
    }

    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(name)}&display=20&sort=random`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      return serviceInternalError(
        new Error(`Naver API error: ${response.status}`)
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return serviceSuccess({ stores: [], total: 0 });
    }

    const stores: Store[] = data.items.map((item: NaverLocalItem) => ({
      name: item.title?.replace(/<[^>]*>/g, "") || "Unknown",
      address: item.address || "",
      roadAddress: item.roadAddress || "",
      telephone: item.telephone || "",
      x: item.mapx || "0",
      y: item.mapy || "0",
      category: item.category || "",
      link: item.link || "",
    }));

    if (coords) {
      const userLat = parseFloat(coords.y);
      const userLng = parseFloat(coords.x);

      stores.forEach((store) => {
        const storeLat = parseInt(store.y) / 10000000;
        const storeLng = parseInt(store.x) / 10000000;

        const R = 6371;
        const dLat = ((storeLat - userLat) * Math.PI) / 180;
        const dLng = ((storeLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((storeLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        store.distance = Math.round(R * c * 1000);
      });

      stores.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }

    return serviceSuccess({ stores, total: data.total });
  } catch (error) {
    return serviceInternalError(error);
  }
}
