import { Suspense } from "react";
import AllDataHistoryClient from "./AllDataHistoryClient";
import Loading from "@/components/loading";

const AllDataHistoryPage = async ({ searchParams }) => {
  const member_id = searchParams?.id || "";

  return (
    <Suspense fallback={<Loading />}>
      <AllDataHistoryClient member_id={member_id} />
    </Suspense>
  );
};

export default AllDataHistoryPage;
