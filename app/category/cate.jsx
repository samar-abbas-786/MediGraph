"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/loading";
import { ToastContainer, toast } from "react-toastify";
import { FaRegStar, FaStar } from "react-icons/fa";
import Bottom_Nav from "@/components/Bottom_Nav";

// -------------------- Category Card Component --------------------
const CategoryCard = ({ item, onSelect, onToggleFrequent }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="relative group p-5 bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    >
      {/* ⭐ Frequent Star */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleFrequent(item.category);
        }}
        className="absolute top-4 right-4 text-yellow-400 text-2xl hover:scale-125 transition-transform"
      >
        {item.isFrequent ? <FaStar /> : <FaRegStar />}
      </div>

      {/* Category Info */}
      <div className="flex items-center justify-between">
        <span className="text-md sm:text-base font-medium text-gray-700 group-hover:text-blue-600 truncate pr-2">
          {item.category}
        </span>
      </div>
    </div>
  );
};

// -------------------- Main Component --------------------
export default function CategoryPageComponent() {
  const router = useRouter();
  const params = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0); // <- trigger Bottom_Nav update

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const id = params.get("id");
      if (!id) return;

      try {
        const res = await axios.get(`/api/get-data-of-member?id=${id}`);
        setCategories(res.data.data || []);
      } catch (err) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [params]);

  // Navigate to add data
  const handleAdd = () => {
    const id = params.get("id");
    router.push(`/category/add-data/${id}`);
  };

  // Navigate to a single category
  const handleSelectCategory = (item) => {
    const id = params.get("id");
    router.push(`/category/${item.category}?id=${id}`);
  };

  // Navigate to all tests for the member
  const handleAllTest = () => {
    const id = params.get("id");
    router.push(`/all-test-on-category?id=${id}`);
  };

  // Toggle frequent category
  const handleMakeFrequent = async (category) => {
    const id = params.get("id");
    try {
      const res = await axios.put("/api/make-frequent-category", {
        id,
        category,
      });
      toast.success(res.data.message);

      // Update main categories locally
      setCategories((prev) =>
        prev.map((item) =>
          item.category === category
            ? { ...item, isFrequent: !item.isFrequent }
            : item
        )
      );

      // Trigger Bottom_Nav refresh
      setRefreshFlag((prev) => prev + 1);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-10 bg-gray-50 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Select Test Category
        </h2>
        <p className="text-gray-500 mt-1">
          Choose a category to view test parameters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          + Add Data
        </button>
        {categories.length > 0 && (
          <button
            onClick={handleAllTest}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            View All Tests
          </button>
        )}
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((item, i) => (
            <CategoryCard
              key={i}
              item={item}
              onSelect={handleSelectCategory}
              onToggleFrequent={handleMakeFrequent}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-100">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
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
          <h3 className="text-lg font-semibold text-gray-700">
            No Categories Found
          </h3>
          <p className="text-sm text-gray-500 mt-1 text-center max-w-xs">
            You haven’t added any test categories yet. Start by adding your
            first category to configure test parameters.
          </p>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="mt-20">
        <Bottom_Nav refresh={refreshFlag} />
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
