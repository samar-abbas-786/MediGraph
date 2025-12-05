"use client";
import React, { Suspense } from "react";
import CategoryPageComponent from "./cate";
export default function CategoryPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          {" "}
          <p className="text-gray-500 text-lg">Loading...</p>{" "}
        </div>
      }
    >
      {" "}
      <CategoryPageComponent />{" "}
    </Suspense>
  );
}
