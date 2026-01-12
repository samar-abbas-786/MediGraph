import Data from "@/models/data";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/database/db";

export const PUT = async (request) => {
  try {
    await db();

    const { id, category } = await request.json();
    const memberId = new mongoose.Types.ObjectId(id);

    // Fetch all matching documents
    const docs = await Data.find({
      member_id: memberId,
      test_category: category,
    });

    if (!docs.length) {
      return NextResponse.json({ message: "No documents found" });
    }

    let modifiedCount = 0;
    let msg = "";
    // Toggle each document
    for (const doc of docs) {
      doc.isFrequent = !doc.isFrequent; // toggle boolean
      if (!doc.isFrequent) {
        msg = "Remove from frequent";
      } else {
        msg = "Added to frequent";
      }
      await doc.save();
      modifiedCount++;
    }

    return NextResponse.json({
      message: msg,
      matched: docs.length,
      modified: modifiedCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Toggle failed", error: error.message },
      { status: 500 }
    );
  }
};
