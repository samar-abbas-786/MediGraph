import Member from "@/models/member";
import Data from "@/models/data";
import db from "@/database/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  db();
  try {
    const { member_id, test_category, test_parameter, value, where, date } =
      await request.json();

    if (
      !member_id ||
      !test_category ||
      !test_parameter ||
      value == null ||
      !where ||
      !date
    ) {
      return NextResponse.json({ message: "missing fields" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(member_id)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 }
      );
    }
    const isMember = await Member.findById(member_id);
    if (!isMember) {
      return NextResponse.json(
        { message: "Member doesn't exist" },
        { status: 400 }
      );
    }
    const data = await Data.create({
      member_id,
      test_category,
      test_parameter,
      value,
      where,
      date,
    });
    if (!data) {
      return NextResponse.json(
        { message: "Failed to upload patient data" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Patient data added successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("add-data failed", error);
    return NextResponse.json(
      { message: "Failed to upload patient data" },
      { status: 400 }
    );
  }
};
