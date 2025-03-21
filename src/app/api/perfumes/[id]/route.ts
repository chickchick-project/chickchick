import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/init";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing perfume ID" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("get_perfume_details", {
    perfume_uuid: id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
