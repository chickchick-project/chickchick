import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { meApi, userApi, USER_ID_REGEX } from "../../utils/api/users.api";
import { queryKeys } from "../../utils/queryKeys";
import type { ApiUpdateMyProfileRequest } from "@/server/hono/schemas/me.schema";

// 내 프로필 조회
export const useUserProfile = (options?: { enabled?: boolean }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? "me";

  // status === "authenticated" 까지 명시적으로 확인해야
  // "loading" 중 이전 세션 userId로 쿼리가 실행되는 레이스 컨디션을 방지한다.
  const isReady =
    status === "authenticated" && userId !== "me";

  return useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: async () => {
      console.log(`[PROFILE][fetch] 쿼리 실행 — queryKey=["user","profile","${userId}"]`);
      try {
        const response = await meApi.profile.get();
        if (!response || !response.success) {
          console.warn(`[PROFILE][fetch] 실패 응답 — userId=${userId}`);
          return null;
        }
        console.log(`[PROFILE][fetch] 성공 — userId=${userId} nickname=${response.data.nickname}`);
        return response.data;
      } catch (error) {
        const errorStatus = (error as { status?: number })?.status;
        if (errorStatus === 401 || errorStatus === 403) {
          console.warn(`[PROFILE][fetch] 인증 실패(${errorStatus}) — userId=${userId}`);
          return null;
        }
        throw error;
      }
    },
    enabled: (options?.enabled ?? true) && isReady,
    retry: (failureCount, error) => {
      // 401, 403 에러는 재시도하지 않음 (인증 실패)
      const errorStatus = (error as { status?: number })?.status;
      if (errorStatus === 401 || errorStatus === 403) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: true, // OAuth 콜백 후 윈도우 포커스 시 재검증
    refetchOnMount: true, // 페이지 이동 후 마운트 시 재검증
    staleTime: 30 * 1000, // 30초: 너무 짧으면 계정 전환 직후 stale 판정으로 이전 데이터가 순간 노출됨
  });
};

// 특정 사용자 프로필 조회
export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: () => userApi.getById(userId),
    enabled: !!userId,
    select: (response) => {
      if (!response || !response.success) return null;
      const user = response.data;
      // ID 유효성 검증
      if (typeof user.id !== "string" || !USER_ID_REGEX.test(user.id)) {
        throw new Error("서버로부터 받은 사용자 ID 형식이 올바르지 않습니다.");
      }
      return user;
    },
  });
};

// 특정 사용자의 컬렉션 목록 조회
export const useUserCollections = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.collection.byUserId(userId),
    queryFn: () => userApi.collections(userId),
    select: (response) => {
      if (!response || !response.success) return [];
      return response.data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// 특정 사용자가 북마크한 향수 목록 조회 (Suspense)
export const usePerfumeBookmarks = (userId: string) => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.bookmarks.perfumes(userId),
    queryFn: () => userApi.bookmarks.perfumes(userId),
    select: (response) => {
      if (!response || !response.success) return [];
      return response.data;
    },
  });
};

// 내가 북마크한 게시글 목록 조회 (Suspense)
export const useUserPostsBookmarks = () => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.bookmarks.posts("me"),
    queryFn: () => meApi.bookmarks.posts(),
    select: (response) => {
      if (!response || !response.success) return [];
      return response.data;
    },
  });
};

// 내 리뷰 목록 조회 (Suspense)
export const useUserReview = () => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.reviews("me"),
    queryFn: async () => {
      const response = await meApi.reviews();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch reviews");
      }
      return response.data;
    },
  });
};

// 내 게시글 목록 조회 (Suspense)
export const useUserPost = () => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.posts("me"),
    queryFn: async () => {
      const response = await meApi.posts();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch posts");
      }
      return response.data;
    },
  });
};

// 내 댓글 목록 조회 (Suspense)
export const useUserComment = () => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.comments("me"),
    queryFn: async () => {
      const response = await meApi.comments();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch comments");
      }
      return response.data;
    },
  });
};

// 내가 좋아요한 향수 목록 조회 (Suspense)
export const useUserLikedPerfume = () => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.likes.perfumes("me"),
    queryFn: async () => {
      const response = await meApi.likes.perfumes();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch liked perfumes");
      }
      return response.data;
    },
  });
};

// 내가 좋아요한 게시글 목록 조회 (Suspense)
export const useUserLikedPost = () => {
  return useSuspenseQuery({
    queryKey: queryKeys.user.likes.posts("me"),
    queryFn: async () => {
      const response = await meApi.likes.posts();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch liked posts");
      }
      return response.data;
    },
  });
};

// === Mutations ===

/**
 * 프로필 정보 업데이트 mutation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiUpdateMyProfileRequest) => meApi.profile.update(data),
    onSuccess: (response) => {
      if (response?.success && response.data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(response.data.id) });
      }
    },
  });
};

/**
 * 회원 탈퇴 mutation
 */
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => meApi.account.delete(),
  });
};

/**
 * 프로필 이미지 업로드 mutation
 * 파일 업로드 후 프로필 정보를 자동으로 업데이트합니다.
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, bucketName }: { file: File; bucketName: string }) =>
      meApi.profile.uploadAndUpdateImage(file, bucketName),
    onSuccess: (response) => {
      // 프로필 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile("me") });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(response.data.id),
      });

      // 옵티미스틱 업데이트를 위해 즉시 캐시 업데이트
      queryClient.setQueryData(queryKeys.user.profile("me"), response);
      queryClient.setQueryData(
        queryKeys.user.profile(response.data.id),
        response,
      );
    },
    onError: (error) => {
      console.error("프로필 이미지 업로드 실패:", error);
    },
  });
};
