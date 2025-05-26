import { NextResponse } from "next/server";
import {
  fetchUserInfo,
  fetchUserCollection,
  addUserCollection,
} from "@/lib/queries/userQueries";

export async function GET() {
  try {
    const user = await fetchUserInfo();
    const data = await fetchUserCollection(user.id);
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
    const { perfume_id } = await req.json();
    const response = await addUserCollection(user.id, perfume_id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
