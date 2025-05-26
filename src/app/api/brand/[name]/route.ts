import { NextRequest, NextResponse } from "next/server";
import { fetchBrandWithPerfumes } from "@/lib/queries/brandQueries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
): Promise<NextResponse> {
  const { name } = await params;

  if (!name) {
    return NextResponse.json(
      { error: "브랜드 이름이 제공되지 않았습니다." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchBrandWithPerfumes(name);

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
