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
        { status: 400 }
      );
    }

    const result = await Data.aggregate([
      {
        $match: {
          member_id: new mongoose.Types.ObjectId(memberId),
        },
      },

      // 2️⃣ Sort by date for graph correctness
      {
        $sort: { createdAt: 1 }, // or test_date
      },

      // 3️⃣ Group by PARAMETER ONLY
      {
        $group: {
          _id: "$test_parameter",
          readings: {
            $push: {
              value: "$value",
              date: "$createdAt", // or "$date"
              unit: "$unit",
            },
          },
        },
      },

      // 4️⃣ Clean output
      {
        $project: {
          _id: 0,
          parameter: "$_id",
          readings: 1,
        },
      },

      // Optional: sort parameters alphabetically
      {
        $sort: { parameter: 1 },
      },
    ]);

    return NextResponse.json(
      {
        message: "Graph data fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
