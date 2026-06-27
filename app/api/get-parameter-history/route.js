import { NextResponse } from "next/server";
import Data from "@/models/data";
import db from "@/database/db";

export const GET = async (request) => {
  await db();

  const id = request.nextUrl.searchParams.get("id");
  const category = request.nextUrl.searchParams.get("category");
  const parameter = request.nextUrl.searchParams.get("parameter");

  const memberIdQuery = mongoose.Types.ObjectId.isValid(id)
    ? { $in: [id, new mongoose.Types.ObjectId(id)] }
    : id;

  const data = await Data.find({
    member_id: memberIdQuery,
    test_category: category,
    test_parameter: parameter,
  })
    .sort({ date: 1 })
    .select("value where date test_category test_parameter");

  return NextResponse.json({ data });
};
