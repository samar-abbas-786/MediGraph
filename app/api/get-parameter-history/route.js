import { NextResponse } from "next/server";
import Data from "@/models/data";
import db from "@/database/db";

export const GET = async (request) => {
  db();

  const id = request.nextUrl.searchParams.get("id");
  const category = request.nextUrl.searchParams.get("category");
  const parameter = request.nextUrl.searchParams.get("parameter");

  const data = await Data.find({
    member_id: id,
    test_category: category,
    test_parameter: parameter,
  })
    .sort({ date: 1 })
    .select("value date -_id");

  return NextResponse.json({ data });
};
