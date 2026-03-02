import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase
    .from("layouts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, boundary_coords, extra_data } = body;
    if (!name || !boundary_coords)
      return NextResponse.json(
        { error: "name and boundary_coords required" },
        { status: 400 }
      );

    const payload = {
      name,
      boundary_coords:
        typeof boundary_coords === "string"
          ? JSON.parse(boundary_coords)
          : boundary_coords,
      extra_data: extra_data || null,
    };

    const { data, error } = await supabase
      .from("layouts")
      .insert([payload])
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
