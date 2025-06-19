import { supabase } from "@/lib/supabase/init";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_SIZE = 5 * 1024 * 1024;

const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

export async function getPostImageUrl(file: File) {
  if (!bucket) {
    throw new Error("Supabase Storage 버킷 환경변수가 설정되지 않았습니다.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    alert("지원하지 않는 이미지 형식입니다.");
    return;
  }

  if (file.size > MAX_SIZE) {
    alert("5MB 이하 파일만 업로드할 수 있습니다.");
    return;
  }
  const safeName = file.name.replace(/[^\w.-]/gi, "_");
  const filePath = `${Date.now()}_${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
