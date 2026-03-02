import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase.from("user_role").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
