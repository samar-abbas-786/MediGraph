import { Suspense } from "react";
import AllTestsPageClient from "./AllTestsPageClient";
import Loading from "@/components/loading";

const AllTestsPageOnCategory = async ({ searchParams }) => {
  const params = await searchParams;
  const member_id = params?.id || "";

  return (
    <Suspense fallback={<Loading />}>
      <AllTestsPageClient member_id={member_id} />
    </Suspense>
  );
};

export default AllTestsPageOnCategory;
