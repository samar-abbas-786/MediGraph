"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loading from "@/components/loading";

const Bottom_Nav = ({ refresh }) => {
  const router = useRouter();
  const params = useSearchParams();

  const [frequentCategories, setFrequentCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch frequent categories whenever 'refresh' changes
  useEffect(() => {
    const fetchFrequentCategories = async () => {
      setLoading(true);
      const id = params.get("id");
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `/api/find-frequent-data-of-member?id=${id}`,
        );
        setFrequentCategories(res.data.data || []);
      } catch (err) {
        toast.error("Failed to fetch frequent categories");
      } finally {
        setLoading(false);
      }
    };

    fetchFrequentCategories();
  }, [params, refresh]);

  // Navigate to category page
  const handleSelectCategory = (item) => {
    const id = params.get("id");
    router.push(`/category/${item.category}?id=${id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="fixed bottom-0 w-full bg-white shadow-inner py-2 px-3 border-t border-gray-200 z-50">
      <h3 className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
        Frequent Categories
      </h3>
      {frequentCategories.length > 0 ? (
        <div className="flex overflow-x-auto space-x-2 px-2">
          {frequentCategories.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelectCategory(item)}
              className="flex-shrink-0 px-3 py-1 bg-blue-50 text-blue-600 font-medium text-xs rounded-full border border-blue-200 hover:bg-blue-100 hover:scale-105 transition-transform duration-150"
            >
              {item.category}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-xs italic">No frequent categories</p>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Bottom_Nav;
