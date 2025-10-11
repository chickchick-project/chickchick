import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, uploadProfileImage } from "./profile.hepler";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "profile"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUploadProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      // 프로필 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["me", "profile"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", data.data.id],
      });

      // 옵티미스틱 업데이트를 위해 즉시 캐시 업데이트
      queryClient.setQueryData(["me", "profile"], data.data);
      queryClient.setQueryData(["user", "profile", data.data.id], data.data);
    },
    onError: (error) => {
      console.error("프로필 이미지 업로드 실패:", error);
    },
  });
};
