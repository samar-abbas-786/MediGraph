"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/loading";

export default function CategoryPageComponent() {
  const router = useRouter();
  const params = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const id = params.get("id");
      if (!id) return;
      const res = await axios.get(`/api/get-data-of-member?id=${id}`);
      setCategories(res.data.data || []);
      setLoading(false);
    };
    fetchCategories();
  }, [params]);

  const handleSelectCategory = (item) => {
    const id = params.get("id");
    router.push(`/category/${item.category}?id=${id}`);
  };

  const handleViewAllTests = (item) => {
    const id = params.get("id");
    router.push(`/category/${item.category}/all-tests?id=${id}`);
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200">
        {" "}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Select Test Category{" "}
        </h2>{" "}
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Choose a category to view test parameters{" "}
        </p>{" "}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((item, i) => (
          <button
            onClick={() => handleSelectCategory(item)}
            key={i}
            className="group p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <div
              onClick={() => handleSelectCategory(item)}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate pr-2">
                {item.category}
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
