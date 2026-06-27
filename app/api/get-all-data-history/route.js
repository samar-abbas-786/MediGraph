import { NextResponse } from "next/server";
import Data from "@/models/data";
import db from "@/database/db";
import mongoose from "mongoose";

export const GET = async (request) => {
  await db();

  try {
    const memberId = request.nextUrl.searchParams.get("id");

    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { message: "Invalid member id" },
        { status: 400 },
      );
    }

    const memberIdQuery = {
      $in: [memberId, new mongoose.Types.ObjectId(memberId)],
    };

    const entries = await Data.find({ member_id: memberIdQuery })
      .sort({ date: -1 })
      .select("test_category test_parameter value where date")
      .lean();

    return NextResponse.json(
      { message: "History fetched successfully", data: entries },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching history", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
