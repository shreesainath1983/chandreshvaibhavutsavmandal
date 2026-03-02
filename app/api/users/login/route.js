import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";
import { errorMessage } from "../../errorCodes";

// POST /api/users/login
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: errorMessage.CREDENTIAL_REQUIRED },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("members")
      .select(
        `
        id, 
        name, 
        email, 
        mobile, 
        role_id, 
        designation:designation_id (
          id,
          designation
        ),
        is_lock`,
      )
      .eq("email", email)
      .eq("password", password)
      .single();

    if (!data) {
      return NextResponse.json(
        { error: errorMessage.INVALID_CREDENTIALS },
        { status: 401 },
      );
    }
    if (data.is_lock) {
      return NextResponse.json(
        { error: errorMessage.ACCOUNT_LOCKED },
        { status: 403 },
      );
    }
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
