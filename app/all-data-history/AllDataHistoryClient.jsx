"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loading from "@/components/loading";

const PAGE_SIZE = 10;

const AllDataHistoryClient = ({ member_id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchParameter, setSearchParameter] = useState("");
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const categoryMatch = item.test_category
        .toLowerCase()
        .includes(searchCategory.toLowerCase());
      const parameterMatch = item.test_parameter
        .toLowerCase()
        .includes(searchParameter.toLowerCase());
      return categoryMatch && parameterMatch;
    });
  }, [data, searchCategory, searchParameter]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pageData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this entry?");
    if (!confirmed) return;

    try {
      await axios.delete("/api/delete-data", { data: { data_id: id } });
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Full Data History
          </h1>
          <p className="text-sm text-gray-500">
            Search by category or parameter, then edit or delete entries.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 w-full sm:w-auto">
          <input
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            placeholder="Search category"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            value={searchParameter}
            onChange={(e) => setSearchParameter(e.target.value)}
            placeholder="Search parameter"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {pageData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
          No history entries found.
        </div>
      ) : (
        <div className="space-y-4">
          {pageData.map((entry) => (
            <div
              key={entry._id}
              className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-base font-medium text-gray-900">
                    {entry.test_category}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Parameter</p>
                  <p className="text-base font-medium text-gray-900">
                    {entry.test_parameter}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="mt-1 text-sm text-gray-900">{entry.value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Where</p>
                  <p className="mt-1 text-sm text-gray-900">{entry.where}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(entry.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(entry)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(entry._id)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Showing {pageData.length} of {filteredData.length} entries.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllDataHistoryClient;
