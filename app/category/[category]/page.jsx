"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import axios from "axios";
import ParameterList from "../../../components/ParameterList";

export default function ParameterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { category } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const id = params.get("id");
      const res = await axios.get(`/api/get-data-of-member?id=${id}`);
      const categories = res.data.data || [];
      const obj = categories.find((c) => c.category === category);
      setData(obj || null);
    };

    fetchCategory();
  }, [category, params]);

  const handleSelectParameter = (param) => {
    const id = params.get("id");
    router.push(`/category/${category}/${param}?id=${id}`);
  };

  const handleBack = () => router.back();

  return (
    data && (
      <ParameterList
        category={data}
        onSelectParameter={handleSelectParameter}
        onBack={handleBack}
      />
    )
  );
}
