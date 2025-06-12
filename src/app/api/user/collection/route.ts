import { NextResponse } from "next/server";
import {
  fetchCurrentUserInfo,
  fetchUserCollection,
  addUserCollection,
} from "@/lib/queries/userQueries";

export async function GET() {
  try {
    const user = await fetchCurrentUserInfo();
    const data = await fetchUserCollection(user.data!.id);
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
    const { perfume_id } = await req.json();
    const response = await addUserCollection(user.data!.id, perfume_id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
