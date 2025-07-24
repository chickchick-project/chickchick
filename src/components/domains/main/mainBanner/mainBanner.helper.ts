import { PerfumeResponse } from "@/lib/hono/schemas/perfume.schema";

export async function getBannerData(
  themeName: string
): Promise<PerfumeResponse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/v1/perfumes/theme?q=${themeName}`, {
      next: {
        tags: ["main-banner", `theme-${themeName}`],
      },
    });
    const { data } = await res.json();
    if (!res.ok) {
      console.error("Failed to fetch banner data:", res.statusText);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error in getBannerData:", error);
    return [];
  }
}
