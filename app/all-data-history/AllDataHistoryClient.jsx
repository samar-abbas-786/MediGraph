"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loading from "@/components/loading";

const PAGE_SIZE = 10;

const AllDataHistoryClient = ({ member_id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    if (!member_id) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/get-all-data-history?id=${member_id}`,
      );

      setData(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
      setError("Unable to load data history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [member_id]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));

  const pageData = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [data]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?",
    );

    if (!confirmed) return;

    try {
      await axios.delete("/api/delete-data", {
        data: { data_id: id },
      });

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      window.alert("Failed to delete entry.");
    }
  };

  const handleEdit = (entry) => {
    const query = new URLSearchParams({
      category: entry.test_category,
      parameter: entry.test_parameter,
      editId: entry._id,
      id: member_id,
    }).toString();

    window.location.href = `/category/add-data/${member_id}?${query}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data History</h1>

        <p className="text-gray-500 mt-2">
          View, edit and manage all recorded health data.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {pageData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 shadow-sm">
          No health records found.
        </div>
      ) : (
        <div className="space-y-5">
          {pageData.map((entry) => (
            <div
              key={entry._id}
              className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6"
            >
              {/* Top Section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Category
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {entry.test_category}
                  </h2>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Parameter
                  </p>
                  <h2 className="text-lg font-semibold text-blue-600">
                    {entry.test_parameter}
                  </h2>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Recorded Value</p>
                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {entry.value}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-2 text-base font-medium text-gray-900">
                    {entry.where}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="mt-2 text-base font-medium text-gray-900">
                    {new Date(entry.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => handleEdit(entry)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(entry._id)}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {sortedData.length > PAGE_SIZE && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing {pageData.length} of {sortedData.length} entries
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 border rounded-xl bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {pageCount}
            </span>

            <button
              disabled={page >= pageCount}
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              className="px-4 py-2 border rounded-xl bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDataHistoryClient;
