import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseServer";

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      epicNo,
      firstName,
      middleName,
      lastName,
      wing,
      roomNo,
      building,
      area,
      remark,
      userId,
    } = body;

    if (!epicNo) {
      return NextResponse.json(
        { error: "epicNo is required" },
        { status: 400 }
      );
    }

    const updateData = {
      F_Name: firstName || null,
      M_Name: middleName || null,
      L_Name: lastName || null,
      Wing: wing || null,
      Room_No: roomNo || null,
      Building_Name: building || null,
      Area: area || null,
      Remark: remark || null,
      Modified_By: userId || null,
      Modified_Date: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("voterdata")
      .update(updateData)
      .eq("Epic", epicNo)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update voter data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data, message: "Voter updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
