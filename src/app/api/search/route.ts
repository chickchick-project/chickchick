import { NextResponse } from "next/server";
import { fetchSearch } from "@/lib/supabase/query/search";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "";
  const limit = Number(url.searchParams.get("limit")) || 15;

  if (!query) {
    return NextResponse.json(
      { error: "검색어를 입력하세요." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchSearch(query, limit);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "검색 결과가 없습니다." },
        { status: 200 }
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
