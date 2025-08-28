// import { supabase } from "@/lib/supabase/init";
// import { prisma } from "@/lib/prisma";

// /**
//  * 모든 브랜드 목록 조회
//  */
// export async function fetchAllBrands() {
//   const data = await prisma.brand.findMany();

//   if (!data) {
//     throw new Error("브랜드를 찾을 수 없습니다.");
//   }

//   return data;
// }

// /**
//  * 특정 브랜드 ID로 브랜드 상세 조회
//  */
// export async function fetchBrandWithPerfumes(brandName: string) {
//   const { data, error } = await supabase.rpc("get_brand_with_perfumes", {
//     brand_name: brandName,
//   });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// }
