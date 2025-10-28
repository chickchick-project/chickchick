import { supabase } from "@/lib/supabase/init";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
} from "../utils/service.utils";
import type {
  AvailableFiltersResponse,
  AvailableFiltersTotalResponse,
  FilterRequestBody,
  RawFilterOption,
} from "../schemas/filter.schema";

function processFilters(params: FilterRequestBody) {
  const toNullableArray = (arr: string[] | undefined) =>
    arr && arr.length > 0 ? arr : null;

  return {
    brandFilter: toNullableArray(params.brandFilter),
    notesFilter: toNullableArray(params.notesFilter),
    accordsFilter: toNullableArray(params.accordsFilter),
  };
}

/**
 * 선택 가능한 상세 필터 목록을 조회하는 서비스
 */
export async function getAvailableFiltersService(
  params: FilterRequestBody
): Promise<ServiceResult<AvailableFiltersResponse>> {
  try {
    const { brandFilter, notesFilter, accordsFilter } = processFilters(params);

    const rpcParams = {
      search_text: params.searchText || "",
      brand_filter: brandFilter,
      notes_filter: notesFilter,
      accords_filter: accordsFilter,
    };

    const { data: rawData, error } = await supabase.rpc(
      "get_available_filters",
      rpcParams
    );

    if (error) throw error;

    const initialResponse: AvailableFiltersResponse = {
      notes: [],
      accords: [],
      brands: [],
    };

    if (!rawData) return serviceSuccess(initialResponse);

    const result = rawData.reduce(
      (acc: AvailableFiltersResponse, item: RawFilterOption) => {
        const transformedItem = {
          id: item.id,
          nameKo: item.name_ko,
          nameEn: item.name_en,
          count: item.count,
        };
        if (item.category === "notes") {
          acc.notes.push(transformedItem);
        } else if (item.category === "accords") {
          acc.accords.push(transformedItem);
        } else if (item.category === "brands") {
          acc.brands.push(transformedItem);
        }
        return acc;
      },
      initialResponse
    );

    // 정렬은 클라이언트에서 선택된 필터를 고려하여 수행
    return serviceSuccess(result);
  } catch (error) {
    console.error("Available filters service error:", error);
    return serviceInternalError(error);
  }
}

/**
 * 필터 카테고리별 총 개수를 조회하는 서비스
 */
export async function getAvailableFiltersTotalService(
  params: FilterRequestBody
): Promise<ServiceResult<AvailableFiltersTotalResponse>> {
  try {
    const { brandFilter, notesFilter, accordsFilter } = processFilters(params);

    const rpcParams = {
      search_text: params.searchText || "",
      brand_filter: brandFilter,
      notes_filter: notesFilter,
      accords_filter: accordsFilter,
    };

    const { data, error } = await supabase.rpc(
      "get_available_filters_total",
      rpcParams
    );

    if (error) throw error;

    return serviceSuccess(data ?? []);
  } catch (error) {
    console.error("Available filters total service error:", error);
    return serviceInternalError(error);
  }
}
