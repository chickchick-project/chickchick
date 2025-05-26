import { NextResponse } from "next/server";
import { fetchAllBrands } from "@/lib/queries/brandQueries";

export async function GET() {
  try {
    const data = await fetchAllBrands();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
