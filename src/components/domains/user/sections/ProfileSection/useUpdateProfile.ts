import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "./profile.hepler";

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
