import { Suspense } from "react";
import AllTestsPageClient from "./AllTestsPageClient";
import Loading from "@/components/loading";

const AllTestsPage = async ({ params, searchParams }) => {
  const p = await params;
  const sp = await searchParams;

  const member_id = sp?.id || "";
  const category = decodeURIComponent(p?.category || "");

  return (
    <Suspense fallback={<Loading />}>
      <AllTestsPageClient member_id={member_id} category={category} />
    </Suspense>
  );
};

export default AllTestsPage;
