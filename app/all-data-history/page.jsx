import Link from "next/link";

const AllDataHistoryPage = ({ searchParams }) => {
  const member_id = searchParams?.id || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Full history now uses member-specific URLs.
        </h1>
        <p className="text-gray-600 mb-6">
          Please open history using the path format{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            /all-data-history/&lt;memberId&gt;
          </code>
          .
        </p>
        {member_id ? (
          <Link
            href={`/all-data-history/${member_id}`}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Open history for this member
          </Link>
        ) : (
          <p className="text-sm text-gray-500">
            No member ID was provided. Open the category page and click View All
            History.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllDataHistoryPage;
