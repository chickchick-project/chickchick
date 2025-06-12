import { NextResponse } from "next/server";
import {
  fetchUserInfo,
  fetchUserBookmarks,
  addUserBookmark,
} from "@/lib/queries/userQueries";

export async function GET() {
  try {
    const user = await fetchUserInfo();
    const data = await fetchUserBookmarks(user.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await fetchUserInfo();
    const { item_id, item_type } = await req.json();
    const response = await addUserBookmark(user.id, item_id, item_type);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
