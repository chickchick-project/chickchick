import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { apiClient } from "@/lib/utils/api/client";

export async function getBannerData(
  themeName: string,
): Promise<ApiPerfumeSimpleResponse[]> {
  const isBuildTime =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.CI === "true" ||
    (process.env.NODE_ENV === "production" && !process.env.VERCEL_URL);

  if (isBuildTime) {
    console.log("Skipping getBannerData during build time");
    return [];
  }

  try {
    const result = await apiClient.get<{ data: ApiPerfumeSimpleResponse[] }>(
      `/perfumes/theme?themeName=${themeName}`,
      {
        next: {
          revalidate: 60, // 60초마다 재검증
          tags: ["main-banner", `theme-${themeName}`],
        },
      },
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
