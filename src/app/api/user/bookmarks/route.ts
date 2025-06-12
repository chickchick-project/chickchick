import { NextResponse } from "next/server";
import {
  fetchCurrentUserInfo,
  fetchUserBookmarks,
  addUserBookmark,
} from "@/lib/queries/userQueries";

export async function GET() {
  try {
    const user = await fetchCurrentUserInfo();
    const data = await fetchUserBookmarks(user.data!.id);
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
    const user = await fetchCurrentUserInfo();
    const { item_id, item_type } = await req.json();
    const response = await addUserBookmark(user.data!.id, item_id, item_type);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
