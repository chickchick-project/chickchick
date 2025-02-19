import { NextResponse } from "next/server";
import { fetchUserInfo } from "@/lib/supabase/query/user";

export async function GET() {
  try {
    const user = await fetchUserInfo();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}
