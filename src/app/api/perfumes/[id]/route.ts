import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/init";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const perfumeId = params.id;

  if (!perfumeId) {
    return NextResponse.json({ error: "Missing perfume ID" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("get_perfume_details", {
    perfume_uuid: perfumeId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
