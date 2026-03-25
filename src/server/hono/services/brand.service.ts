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
} from "../schemas/brand.schema";
import { brandDetailSelect, parseMapLocation } from "../repositories/brand.repository";

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
