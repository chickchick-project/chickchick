import { ApiMyProfileResponse } from "../hono/schemas/me.schema";
import { createHttpClient } from "./core-request";

interface RawApiResponse {
  success: boolean;
  message: string;
  data: ApiMyProfileResponse;
}

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

const USER_ID_REGEX = /^[0-9a-fA-F-]{36}$/;

export const getUserProfile = () => {
  return apiClient.get<RawApiResponse, ApiMyProfileResponse>(
    "/me/profile",
    {},
    {
      transformResponse: (response: RawApiResponse) => response.data,
    }
  );
};

export const getUserById = (userId: string) => {
  return apiClient.get<RawApiResponse, ApiMyProfileResponse>(
    `/users/${userId}`,
    {},
    {
      transformResponse: (response: RawApiResponse) => {
        const user = response.data;
        if (typeof user.id !== "string" || !USER_ID_REGEX.test(user.id)) {
          throw new Error(
            "서버로부터 받은 사용자 ID 형식이 올바르지 않습니다."
          );
        }
        return user;
      },
    }
  );
};
