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
import {
  brandDetailSelect,
  parseMapLocation,
} from "../repositories/brand.repository";

interface KakaoLocalDocument {
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
  category_name: string;
  category_group_code: string;
  distance: string;
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
  brandId: string,
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
  nameKo: string,
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

export async function getStoresByNameService(
  name: string,
  x?: string,
  y?: string,
): Promise<ServiceResult<{ stores: Store[]; total: number }>> {
  try {
    const params = new URLSearchParams({ query: name, size: "15" });
    if (x && y) {
      params.set("x", x);
      params.set("y", y);
      params.set("radius", "20000");
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_MAP_REST_KEY}`,
          KA: "sdk/1.0 os/nodejs",
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.documents) {
      console.error("[Kakao Local API Error]", response.status, data);
      return serviceInternalError(
        new Error(data?.message ?? data?.msg ?? JSON.stringify(data)),
      );
    }

    const stores: Store[] = (data.documents as KakaoLocalDocument[])
      .filter(
        (doc) =>
          (doc.category_name.includes("가정,생활") &&
            doc.category_name.includes("향수")) ||
          doc.category_name.includes("화장품"),
      )
      .map((doc) => ({
        name: doc.place_name,
        address: doc.address_name,
        roadAddress: doc.road_address_name,
        telephone: doc.phone,
        x: doc.x,
        y: doc.y,
        category: doc.category_name,
        categoryGroupCode: doc.category_group_code || "없음",
        distance: doc.distance ? Number(doc.distance) : undefined,
      }));

    return serviceSuccess({ stores, total: stores.length });
  } catch (error) {
    return serviceInternalError(error);
  }
}

interface KakaoRegionDocument {
  region_type: string; // "B" (법정동) | "H" (행정동)
  address_name: string;
  region_1depth_name: string; // 시/도
  region_2depth_name: string; // 구/군
  region_3depth_name: string; // 동/읍/면
  region_4depth_name: string; // 리
  code: string;
  x: number;
  y: number;
}

export async function getRegionByCoordService(
  x?: string,
  y?: string,
): Promise<ServiceResult<KakaoRegionDocument[]>> {
  if (!x || !y) {
    return serviceInternalError(new Error("x, y 좌표가 필요합니다."));
  }

  try {
    const params = new URLSearchParams({ x, y });
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?${params}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_MAP_REST_KEY}`,
          KA: "sdk/1.0 os/nodejs",
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.documents) {
      console.error("[Kakao coord2regioncode Error]", response.status, data);
      return serviceInternalError(
        new Error(data?.message ?? data?.msg ?? JSON.stringify(data)),
      );
    }

    return serviceSuccess(data.documents as KakaoRegionDocument[]);
  } catch (error) {
    return serviceInternalError(error);
  }
}
