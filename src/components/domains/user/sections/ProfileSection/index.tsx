"use client";

import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileActions } from "./components/ProfileActions";

const profileSchema = z.object({
  name: z.string().min(1),
  nickname: z.string().min(1),
  age: z.number().min(0).optional(),
  gender: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileSection = ({ data }: { data: User }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data.name || "",
      nickname: data.nickname || "",
      age: data.age || undefined,
      gender: data.gender || undefined,
    },
  });

  const onSubmit = async (formData: ProfileFormData) => {
    // TODO: 수정 API 호출 로직 구현
    console.log("폼", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("수정되었습니다.");
  };

  // 탈퇴 처리 함수
  const handleWithdraw = () => {
    console.log("탈퇴 버튼 클릭");
    if (confirm("정말로 탈퇴하시겠습니까?")) {
      alert("탈퇴 처리되었습니다.");
      //TODO: 이후 메인으로 처리
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-[120px]">
      <ProfileForm control={control} errors={errors} />
      <ProfileActions onWithdraw={handleWithdraw} isSubmitting={isSubmitting} />
    </form>
  );
};
