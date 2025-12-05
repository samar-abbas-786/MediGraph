// app/api/get-all-tests/route.js
import { NextResponse } from "next/server";
import Data from "@/models/data";
import db from "@/database/db";
import mongoose from "mongoose";
export const GET = async (request) => {
  db();

  try {
    const member_id = request.nextUrl.searchParams.get("id");
    const category = request.nextUrl.searchParams.get("category");

    if (!member_id || !category) {
      return NextResponse.json(
        { message: "Missing member ID or category" },
        { status: 400 }
      );
    }
    const allData = await Data.aggregate([
      {
        $match: {
          member_id: new mongoose.Types.ObjectId(member_id),
          test_category: category,
        },
      },
      {
        $group: {
          _id: "$test_parameter",
          values: {
            $push: {
              value: "$value",
              date: "$date",
            },
          },
        },
      },
    ]);

    return NextResponse.json({ data: allData });
  } catch (err) {
    console.error("Error fetching category data:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
