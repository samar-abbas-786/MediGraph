"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import axios from "axios";
import ParameterList from "../../../components/ParameterList";

export default function ParameterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const id = params.get("id");
      const res = await axios.get(`/api/get-data-of-member?id=${id}`);
      const categories = res.data.data || [];
      const obj = categories.find((c) => c.category === decodedCategory);
      setData(obj || null);
    };

    fetchCategory();
  }, [decodedCategory, params]);

  const handleSelectParameter = (param) => {
    const id = params.get("id");
    router.push(`/category/${category}/${param}?id=${id}`);
  };
  const handleAllTests = () => {
    const id = params.get("id");
    router.push(
      `/category/${encodeURIComponent(decodedCategory)}/all-test?id=${id}`
    );
  };
  const handleBack = () => router.back();

  return (
    data && (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {decodedCategory} Parameters
          </h2>
          <button
            onClick={handleAllTests}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all active:scale-95"
          >
            All Tests
          </button>
        </div>

        <ParameterList
          category={data}
          onSelectParameter={handleSelectParameter}
          onBack={handleBack}
        />
      </div>
    )
  );
}
