import { NextResponse } from "next/server";
import { fetchBrandWithPerfumes } from "@/lib/supabase/query/brands";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const brandName = params.name;

  if (!brandName) {
    return NextResponse.json(
      { error: "브랜드 이름이 제공되지 않았습니다." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchBrandWithPerfumes(brandName);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "해당 브랜드 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
