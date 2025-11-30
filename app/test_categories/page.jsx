"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

import CategoryList from "./CategoryList";
import ParameterList from "./ParameterList";
import GraphView from "./GraphView";

const Test_Category = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = params.get("id");
        const response = await axios.get(`/api/get-data-of-member?id=${id}`);
        setCategories(response.data?.data || []);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [params]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (selectedParameter) {
        setSelectedParameter(null);
        setGraphData([]);
      } else if (selectedCategory) {
        setSelectedCategory(null);
      }
    };

    // Push initial state
    window.history.pushState({ step: "categories" }, "");

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedParameter, selectedCategory]);

  // Update history when navigation happens
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    window.history.pushState({ step: "parameters" }, "");
  };

  const handleSelectParameter = async (param) => {
    setSelectedParameter(param);
    window.history.pushState({ step: "graph" }, "");
    await fetchGraphData(selectedCategory.category, param);
  };

  const handleBackFromParameters = () => {
    setSelectedCategory(null);
    window.history.back();
  };

  const handleBackFromGraph = () => {
    setSelectedParameter(null);
    setGraphData([]);
    window.history.back();
  };

  // Fetch graph data for selected parameter
  const fetchGraphData = async (category, parameter) => {
    try {
      setLoading(true);
      setError(null);
      const id = params.get("id");
      const res = await axios.get(
        `/api/get-parameter-history?id=${id}&category=${category}&parameter=${parameter}`
      );
      setGraphData(res.data.data || []);
    } catch (err) {
      setError("Failed to load graph data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      {/* Loading State */}
      {loading && (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
            <div className="flex items-start sm:items-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm sm:text-base text-red-700 font-medium">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1 → CATEGORY LIST */}
      {!loading && !error && !selectedCategory && (
        <CategoryList
          data={categories}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* STEP 2 → PARAMETER LIST */}
      {!loading && !error && selectedCategory && !selectedParameter && (
        <ParameterList
          category={selectedCategory}
          onSelectParameter={handleSelectParameter}
          onBack={handleBackFromParameters}
        />
      )}

      {/* STEP 3 → GRAPH VIEW */}
      {!loading && !error && selectedParameter && (
        <GraphView
          category={selectedCategory.category}
          parameter={selectedParameter}
          graphData={graphData}
          onBack={handleBackFromGraph}
        />
      )}
    </div>
  );
};

export default Test_Category;
