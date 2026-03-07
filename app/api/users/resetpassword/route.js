import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";
import { errorMessage } from "../../errorCodes";

// POST /api/users/resetpassword
export async function POST(req) {
  try {
    const body = await req.json();
    const { id, oldPassword, newPassword } = body;
    console.log("Received password reset request for user ID:", id);
    console.log("Request body:", body);
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: errorMessage.CREDENTIAL_REQUIRED },
        { status: 400 },
      );
    } else if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: errorMessage.NEW_PASSWORD_SAME_AS_OLD },
        { status: 400 },
      );
    } else {
      const { data: user, error: userError } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();
      if (userError || !user) {
        return NextResponse.json(
          { error: errorMessage.USER_NOT_FOUND },
          { status: 404 },
        );
      }
      // Check if old password matches the one in DB
      if (user.password !== oldPassword) {
        return NextResponse.json(
          { error: errorMessage.INVALID_OLD_PASSWORD }, // Assuming this error code exists; adjust if needed
          { status: 400 },
        );
      }
      // Update the password in DB
      const { error: updateError } = await supabase
        .from("members")
        .update({ password: newPassword })
        .eq("id", id);
      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 500 },
        );
      }
      // Return success
      return NextResponse.json(
        { message: "Password reset successfully" },
        { status: 200 },
      );
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
