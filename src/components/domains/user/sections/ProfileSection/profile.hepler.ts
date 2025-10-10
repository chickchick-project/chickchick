import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { createHttpClient } from "@/lib/utils/core-request";

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export const updateUserProfile = (formData: ApiMyProfileResponse) => {
  console.log(formData);
  // return Promise.resolve();
  return apiClient.patch(`/me/profile`, formData);
};
