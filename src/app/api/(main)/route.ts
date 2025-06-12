import { NextResponse } from "next/server";
import { fetchPerfumesWithBanner } from "@/lib/queries/perfumeQueries";

// TODO: 각 주제에 맞는 필터 적용 필요
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 15;

  try {
    const data = await fetchPerfumesWithBanner(page, limit);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
