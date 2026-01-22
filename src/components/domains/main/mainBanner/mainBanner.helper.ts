import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { apiClient } from "@/lib/utils/api/client";

export async function getBannerData(
  themeName: string
): Promise<ApiPerfumeSimpleResponse[]> {
  try {
    const result = await apiClient.get<{ data: ApiPerfumeSimpleResponse[] }>(
      `/perfumes/theme?themeName=${themeName}`,
      {
        cache: "no-store",
        next: {
          tags: ["main-banner", `theme-${themeName}`],
        },
      }
    );

    if (!result) {
      console.error("Failed to fetch banner data");
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Error in getBannerData:", error);
    return [];
  }
}
