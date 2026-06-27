import { NextResponse } from "next/server";
import Data from "@/models/data";
import db from "@/database/db";
import mongoose from "mongoose";

export const DELETE = async (request) => {
  db();
  try {
    const { data_id } = await request.json();

    if (!data_id) {
      return NextResponse.json({ message: "missing fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(data_id)) {
      return NextResponse.json({ message: "Invalid data ID" }, { status: 400 });
    }

    const deleted = await Data.findByIdAndDelete(data_id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Data entry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Data entry deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("delete-data failed", error);
    return NextResponse.json(
      { message: "Failed to delete patient data" },
      { status: 500 },
    );
  }
};
