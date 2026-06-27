import AllDataHistoryClient from "../AllDataHistoryClient";

const AllDataHistoryByMemberPage = async ({ params }) => {
  const { memberId } = await params;

  return <AllDataHistoryClient member_id={memberId} />;
};

export default AllDataHistoryByMemberPage;
