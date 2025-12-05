import { NextResponse } from "next/server";
import db from "@/database/db";
import Data from "@/models/data";

export const GET = async () => {
  db();

  try {
    const categories = await Data.distinct("test_category");

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
