import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseServer";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate || !toDate) {
    return NextResponse.json(
      { error: "From date and To date are required" },
      { status: 400 }
    );
  }

  const fromDateTime = `${fromDate} 00:00:00`;
  const toDateTime = `${toDate} 23:59:59`;

  const { data, error } = await supabase
    .from("voterdata")
    .select(
      `
      Epic,
      Modified_By,
      Wing,
      Room_No,
      Building_Name,
      Area,
      users (
        id,
        name
      )
    `
    )
    .gte("Modified_Date", fromDateTime)
    .lte("Modified_Date", toDateTime)
    .not("Modified_By", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const reportMap = {};

  data.forEach((row) => {
    const userId = row.Modified_By;
    const userName = row.users?.name || "Unknown";

    if (!reportMap[userId]) {
      reportMap[userId] = {
        user_id: userId,
        user_name: userName,
        total_entries: 0,
        address_updated: 0,
      };
    }

    // total entries
    reportMap[userId].total_entries += 1;

    // address updated logic
    const addressUpdated =
      (row.Wing && row.Wing.trim() !== "") ||
      (row.Room_No && row.Room_No.trim() !== "") ||
      (row.Building_Name && row.Building_Name.trim() !== "") ||
      (row.Area && row.Area.trim() !== "");

    if (addressUpdated) {
      reportMap[userId].address_updated += 1;
    }
  });

  return NextResponse.json({
    data: Object.values(reportMap),
  });
}
