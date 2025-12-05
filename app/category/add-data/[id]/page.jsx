"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Add_Data = () => {
  const [test_category, setTestCategory] = useState("");
  const [manualCategory, setManualCategory] = useState("");
  const [test_parameter, setTestParameter] = useState("");
  const [value, setValue] = useState("");
  const [where, setWhere] = useState("");
  const [date, setDate] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const params = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await axios.get("/api/get-all-category");
      console.log("res", response.data);

      if (response.status === 200) {
        setCategoryList(response.data?.data || []);
      }
    };

    fetchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      test_category === "__manual__" ? manualCategory : test_category;

    try {
      const response = await axios.post("/api/add-data", {
        member_id: params.id,
        test_category: finalCategory,
        test_parameter,
        value,
        where,
        date,
      });

      if (response.status === 200) {
        toast.success(response.data?.message || "Successfully added");
      }
    } catch (error) {
      console.log("error in add data handle submit", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Add Health Data
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Test Category
            </label>

            {categoryList.length > 0 && (
              <select
                value={test_category}
                onChange={(e) => {
                  setTestCategory(e.target.value);
                  if (e.target.value !== "__manual__") setManualCategory("");
                }}
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
            )}

            {(test_category === "__manual__" || categoryList.length === 0) && (
              <input
                type="text"
                placeholder="Enter category manually"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            )}
          </div>

          {/* Test Parameter */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Test Parameter
            </label>
            <input
              type="text"
              value={test_parameter}
              onChange={(e) => setTestParameter(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Where */}
          <div>
            <label className="block text-sm font-medium mb-1">Where</label>
            <input
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Add_Data;
