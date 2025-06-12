import { NextResponse } from "next/server";
import { fetchPerfumesWithPagination } from "@/lib/queries/perfumeQueries";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 15;

  try {
    const data = await fetchPerfumesWithPagination(page, limit);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
