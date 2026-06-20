"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const params = useParams();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      test_category === "__manual__" ? manualCategory : test_category;

    const finalParameter =
      test_parameter === "__manual__" ? manualParameter : test_parameter;

    if (!finalCategory || !finalParameter || !value || !where || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
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
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to add data. Please try again.";
      toast.error(errorMsg);
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
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Add_Data;
