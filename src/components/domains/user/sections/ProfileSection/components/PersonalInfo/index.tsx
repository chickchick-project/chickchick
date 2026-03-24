"use client";

import { ProfileActions } from "./common/ProfileActions";
import { ProfileForm } from "./common/ProfileForm";

import {
  ApiMyProfileResponse,
  ApiMyProfileResponseSchema,
} from "@/server/hono/schemas/me.schema";
import Form from "@/components/commons/form";
import { useUpdateProfile } from "@/client/hooks/query/useUserQuery";

export const PersonalInfo = (user: ApiMyProfileResponse) => {
  const { mutateAsync, isPending } = useUpdateProfile();
  const defaultValues = {
    id: user.id,
    nickname: user.nickname || "",
    age: user.age || 0,
    gender: user.gender || "UNKNOWN",
    imageUrl: user.imageUrl || "",
  };

  // 탈퇴 처리 함수
  const handleWithdraw = () => {
    console.log("탈퇴 버튼 클릭");
    if (confirm("정말로 탈퇴하시겠습니까?")) {
      alert("탈퇴 처리되었습니다.");
      //TODO: 이후 메인으로 처리
    }
  };

  const onSubmit = async (formData: ApiMyProfileResponse) => {
    const { imageUrl, ...rest } = formData;
    const params = {
      ...rest,
      imageUrl: imageUrl ?? undefined,
    };
    try {
      await mutateAsync(params);
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("제출 실패:", error);
    }
  };

  return (
    <Form<ApiMyProfileResponse>
      schema={ApiMyProfileResponseSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    >
      <ProfileForm />
      <ProfileActions onWithdraw={handleWithdraw} isSubmitting={isPending} />
    </Form>
  );
};
