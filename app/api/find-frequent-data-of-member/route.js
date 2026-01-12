import Data from "@/models/data";
import db from "@/database/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (request) => {
  try {
    // Connect to DB
    await db();

    // Get member ID from query
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Member ID is required" },
        { status: 400 }
      );
    }

    // Use MongoDB aggregation to get distinct categories
    const frequentData = await Data.aggregate([
      {
        $match: {
          member_id: new mongoose.Types.ObjectId(id),
          isFrequent: true,
        },
      },
      {
        $group: {
          _id: "$test_category", // group by category
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id", // rename _id to category
        },
      },
      { $sort: { category: 1 } }, // optional: sort alphabetically
    ]);

    return NextResponse.json({
      success: true,
      data: frequentData, // array of { category: "Blood Test" }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
};
