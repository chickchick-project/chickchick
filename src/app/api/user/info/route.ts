import { NextResponse } from "next/server";
import { fetchCurrentUserInfo } from "@/lib/queries/userQueries";

export async function GET() {
  try {
    const user = await fetchCurrentUserInfo();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}
