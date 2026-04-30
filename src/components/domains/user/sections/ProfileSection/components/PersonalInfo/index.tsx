"use client";

import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileActions } from "./common/ProfileActions";
import { ProfileForm } from "./common/ProfileForm";

import {
  ApiMyProfileResponse,
  ApiUpdateMyProfileRequest,
  ApiUpdateMyProfileRequestSchema,
} from "@/server/hono/schemas/me.schema";
import Form from "@/components/commons/form";
import {
  useDeleteAccount,
  useUpdateProfile,
} from "@/client/hooks/query/useUserQuery";

export const PersonalInfo = (user: ApiMyProfileResponse) => {
  const { mutateAsync, isPending } = useUpdateProfile();
  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteAccount();
  const queryClient = useQueryClient();

  const defaultValues: ApiUpdateMyProfileRequest = {
    nickname: user.nickname || "",
    age: user.age ?? undefined,
    gender: user.gender ?? undefined,
    imageUrl: user.imageUrl ?? undefined,
  };

  const handleWithdraw = async () => {
    if (!confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;
    try {
      await deleteAccount();
      queryClient.clear();
      await signOut({ redirectTo: "/" });
    } catch {
      alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const onSubmit = async (formData: ApiUpdateMyProfileRequest) => {
    try {
      await mutateAsync(formData);
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("제출 실패:", error);
    }
  };

  return (
    <Form<ApiUpdateMyProfileRequest>
      schema={ApiUpdateMyProfileRequestSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    >
      <ProfileForm />
      <ProfileActions
        onWithdraw={handleWithdraw}
        isSubmitting={isPending || isDeleting}
      />
    </Form>
  );
};
