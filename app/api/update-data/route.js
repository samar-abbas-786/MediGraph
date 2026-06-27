import { NextResponse } from "next/server";
import Data from "@/models/data";
import db from "@/database/db";
import mongoose from "mongoose";

export const PATCH = async (request) => {
  db();
  try {
    const { data_id, value, where, date } = await request.json();

    if (!data_id || value == null || !where || !date) {
      return NextResponse.json({ message: "missing fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(data_id)) {
      return NextResponse.json({ message: "Invalid data ID" }, { status: 400 });
    }

    const updated = await Data.findByIdAndUpdate(
      data_id,
      {
        value,
        where,
        date,
      },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Data entry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Data entry updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    console.log("update-data failed", error);
    return NextResponse.json(
      { message: "Failed to update patient data" },
      { status: 500 },
    );
  }
};
