"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EntryHistory from "@/components/EntryHistory";

const Add_Data = () => {
  const [test_category, setTestCategory] = useState("");
  const [manualCategory, setManualCategory] = useState("");

  const [test_parameter, setTestParameter] = useState("");
  const [manualParameter, setManualParameter] = useState("");

  const [value, setValue] = useState("");
  const [where, setWhere] = useState("");
  const [date, setDate] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  const [parameterList, setParameterList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allParametersFlat, setAllParametersFlat] = useState([]);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryCategory = searchParams.get("category") || "";
  const queryParameter = searchParams.get("parameter") || "";
  const queryEditId = searchParams.get("editId") || "";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setPageLoading(true);
        setPageError(null);

        const response = await axios.get("/api/get-all-category");

        if (response.status === 200) {
          const data = response.data?.data || [];
          setAllData(data);

          const categories = data.map((item) => item._id);
          setCategoryList(categories);

          const allParams = [
            ...new Set(data.flatMap((item) => item.all_parameter)),
          ];
          setAllParametersFlat(allParams);

          setParameterList(allParams);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setPageError("Failed to load categories. Please refresh the page.");
        toast.error("Failed to load categories");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    if (!pageLoading && allData.length > 0) {
      if (queryCategory) {
        if (categoryList.includes(queryCategory)) {
          setTestCategory(queryCategory);
          setManualCategory("");
        } else {
          setTestCategory("__manual__");
          setManualCategory(queryCategory);
        }
      }

      if (queryParameter) {
        if (allParametersFlat.includes(queryParameter)) {
          setTestParameter(queryParameter);
          setManualParameter("");
        } else {
          setTestParameter("__manual__");
          setManualParameter(queryParameter);
        }
      }
    }
  }, [
    pageLoading,
    allData,
    categoryList,
    allParametersFlat,
    queryCategory,
    queryParameter,
  ]);

  const handleCategoryChange = (selected) => {
    setTestCategory(selected);
    setManualCategory("");

    setTestParameter("");
    setManualParameter("");

    if (selected === "") {
      setParameterList(allParametersFlat);
      return;
    }

    if (selected === "__manual__") {
      setParameterList([]);
      return;
    }

    const found = allData.find((item) => item._id === selected);
    setParameterList(found?.all_parameter || []);
  };

  const getFinalCategory = () =>
    test_category === "__manual__" ? manualCategory.trim() : test_category;
  const getFinalParameter = () =>
    test_parameter === "__manual__" ? manualParameter.trim() : test_parameter;

  const fetchHistory = async () => {
    const finalCategory = getFinalCategory();
    const finalParameter = getFinalParameter();

    if (!finalCategory || !finalParameter) {
      setHistoryEntries([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const response = await axios.get(
        `/api/get-parameter-history?id=${params.id}&category=${encodeURIComponent(
          finalCategory,
        )}&parameter=${encodeURIComponent(finalParameter)}`,
      );

      setHistoryEntries(response.data.data || []);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistoryEntries([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [
    test_category,
    manualCategory,
    test_parameter,
    manualParameter,
    params.id,
  ]);

  useEffect(() => {
    if (!editingEntryId && queryEditId && historyEntries.length > 0) {
      const entry = historyEntries.find((item) => item._id === queryEditId);
      if (entry) {
        handleEditEntry(entry);
      }
    }
  }, [historyEntries, queryEditId, editingEntryId]);

  const handleParameterChange = (selected) => {
    setTestParameter(selected);
    setManualParameter("");

    if (selected === "__manual__") return;

    const found = allData.find((item) => item.all_parameter.includes(selected));

    if (found) {
      setTestCategory(found._id);
      setParameterList(found.all_parameter);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntryId(entry._id);
    setValue(entry.value?.toString() || "");
    setWhere(entry.where || "");
    setDate(new Date(entry.date).toISOString().slice(0, 10));

    if (entry.test_category && categoryList.includes(entry.test_category)) {
      setTestCategory(entry.test_category);
      setManualCategory("");
    } else if (entry.test_category) {
      setTestCategory("__manual__");
      setManualCategory(entry.test_category);
    }

    if (entry.test_parameter && parameterList.includes(entry.test_parameter)) {
      setTestParameter(entry.test_parameter);
      setManualParameter("");
    } else if (entry.test_parameter) {
      setTestParameter("__manual__");
      setManualParameter(entry.test_parameter);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    const confirmed = window.confirm(
      "Delete this entry? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await axios.delete("/api/delete-data", {
        data: { data_id: entryId },
      });

      if (response.status === 200) {
        toast.success(response.data?.message || "Entry deleted successfully");
        if (editingEntryId === entryId) {
          handleCancelEdit();
        }
        await fetchHistory();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to delete entry. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setValue("");
    setWhere("");
    setDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = getFinalCategory();
    const finalParameter = getFinalParameter();

    if (!finalCategory || !finalParameter || !value || !where || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      if (editingEntryId) {
        const response = await axios.patch("/api/update-data", {
          data_id: editingEntryId,
          value,
          where,
          date,
        });

        if (response.status === 200) {
          toast.success(response.data?.message || "Entry updated successfully");
          setEditingEntryId(null);
          setValue("");
          setWhere("");
          setDate("");
          await fetchHistory();
        }
      } else {
        const response = await axios.post("/api/add-data", {
          member_id: params.id,
          test_category: finalCategory,
          test_parameter: finalParameter,
          value,
          where,
          date,
        });

        if (response.status === 200) {
          toast.success(response.data?.message || "Successfully added");
          // Reset form
          setTestCategory("");
          setManualCategory("");
          setTestParameter("");
          setManualParameter("");
          setValue("");
          setWhere("");
          setDate("");
          router.push(`/category?id=${params.id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to submit data. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
          <div className="mb-4">
            <div className="inline-block p-3 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{pageError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 md:p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Add Health Data
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Test Parameter
            </label>

            <select
              value={test_parameter}
              required
              onChange={(e) => handleParameterChange(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Parameter</option>

              {parameterList.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}

              <option value="__manual__">Other (Write manually)</option>
            </select>

            {test_parameter === "__manual__" && (
              <input
                type="text"
                required
                placeholder="Enter parameter manually"
                value={manualParameter}
                onChange={(e) => setManualParameter(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Test Category
            </label>

            <select
              value={test_category}
              required
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Category</option>
              {categoryList.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__manual__">Other (Write manually)</option>
            </select>

            {test_category === "__manual__" && (
              <input
                required
                type="text"
                placeholder="Enter category manually"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Where</label>
            <input
              type="text"
              required
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Submitting..."
              : editingEntryId
                ? "Update Entry"
                : "Submit"}
          </button>
        </form>

        <EntryHistory
          entries={historyEntries}
          loading={historyLoading}
          selectedCategory={getFinalCategory()}
          selectedParameter={getFinalParameter()}
          editingEntryId={editingEntryId}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Add_Data;
