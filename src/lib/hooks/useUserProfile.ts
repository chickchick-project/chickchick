import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../utils/getUserProfile";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["me", "profile"],
    queryFn: getUserProfile,
  });
};
