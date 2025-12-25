"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/loading";
import { ToastContainer, toast } from "react-toastify";
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
      console.log("Res", res);

      setCategories(res.data.data || []);
      setLoading(false);
    };
    fetchCategories();
  }, [params]);

  const handleAdd = () => {
    const id = params.get("id");

    router.push(`/category/add-data/${id}`);
  };

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
      </div>{" "}
      <button
        onClick={handleAdd}
        className="px-4 py-1 bg-blue-600 m-auto w-fit md:w-fit my-2 text-white rounded-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition"
      >
        + Add Data
      </button>
      {categories.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((item, i) => (
            <button
              onClick={() => handleSelectCategory(item)}
              key={i}
              className="group p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
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
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          {/* Icon */}
          <svg
            className="w-14 h-14 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          {/* Text */}
          <h3 className="text-lg font-semibold text-gray-700">
            No Categories Found
          </h3>
          <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
            You haven’t added any test categories yet. Start by adding your
            first category to configure test parameters.
          </p>

          {/* CTA */}
          {/* <button
      onClick={handleAdd}
      className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
    >
      + Add First Category
    </button> */}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
