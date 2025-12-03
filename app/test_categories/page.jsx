"use client";

import { Suspense } from "react";
import TestCategory from "./test_category";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestCategory />
    </Suspense>
  );
}
