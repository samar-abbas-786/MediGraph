import Owner from "@/models/owner";
import Member from "@/models/member";
import db from "@/database/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verify-token";
export const GET = async (request) => {
  db();
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const id = searchParams.get("id");
    const id = await verifyToken();
    console.log("Id", id);

    if (!id) {
      console.log("No Id");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const isOwner = await Owner.exists({ _id: id });
    if (!isOwner) {
      return NextResponse.json(
        { messgae: "Owner does not exist" },
        { status: 400 }
      );
    }

    const members = await Member.find({ owner_id: id }).select("name age");
    if (members.length == 0) {
      return NextResponse.json(
        { message: "No Member found You" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Successfully got all the members", members },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("get-member error", error);
    return NextResponse.json(
      { message: "Error in getting members for specific owner" },
      { status: 500 }
    );
  }
};
