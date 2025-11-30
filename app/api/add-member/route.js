import Owner from "@/models/owner";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { verifyToken } from "@/utils/verify-token";

export const POST = async (request) => {
  db();
  try {
    const owner_id = await verifyToken();
    const { name, age } = await request.json();
    if (!name || !age || !owner_id) {
      return NextResponse.json({ message: "missing fields" }, { status: 400 });
    }
    const isOwnerExist = await Owner.findById(owner_id);
    if (!isOwnerExist) {
      return NextResponse.json({ message: "Owner not found" }, { status: 400 });
    }

    const isAdded = await Member.findOne({ owner_id, name });
    if (isAdded) {
      return NextResponse.json(
        { message: "Member already added" },
        { status: 409 }
      );
    }
    const member = await Member.create({
      name,
      age,
      owner_id,
    });
    if (!member) {
      return NextResponse.json(
        { message: "member registration failed" },
        { status: 400 }
      );
    } else {
      return NextResponse.json({
        message: "Member added successfully",
        member,
      });
    }
  } catch (error) {
    console.log("Member addition error", error);
    return NextResponse.json(
      { message: "member registration failed" },
      { status: 500 }
    );
  }
};
