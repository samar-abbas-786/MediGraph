import Member from "@/models/member";
import db from "@/database/db";
import { NextResponse } from "next/server";
import Data from "@/models/data";
import mongoose from "mongoose";
import { verifyToken } from "@/utils/verify-token";

export const GET = async (request) => {
  db();
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const isMember = await Member.exists({ _id: id });
    if (!isMember) {
      return NextResponse.json({ message: "No Member Exist" }, { status: 400 });
    }
    const isDataExistForMember = await Data.exists({ member_id: id });
    if (!isDataExistForMember) {
      console.log("No data for this member");
      return NextResponse.json(
        { message: "No data for this member" },
        { status: 200 }
      );
    }
    const data = await Data.aggregate([
      {
        $match: {
          member_id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: {
            category: "$test_category",
            parameter: "$test_parameter",
          },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          parameters: { $addToSet: "$_id.parameter" },
        },
      },
      {
        $project: {
          category: "$_id",
          parameters: 1,
          _id: 0,
        },
      },
    ]);

    if (data.length == 0) {
      return NextResponse.json(
        { message: "Data doesn't Exist" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Data found successfully", data },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error in getting data of a member", error);
    return NextResponse.json(
      { message: "Failed in getting data for a member" },
      { status: 500 }
    );
  }
};
