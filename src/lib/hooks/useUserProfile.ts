import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserById } from "../utils/getUserProfile";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["me", "profile"],
    queryFn: getUserProfile,
  });
};

export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () => getUserById(userId),
  });
};
