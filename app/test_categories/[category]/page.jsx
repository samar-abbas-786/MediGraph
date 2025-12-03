"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ParameterList from "@/components/ParameterList";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function ParameterPage() {
  const { category } = useParams();
  const params = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const id = params.get("id");
      const res = await axios.get(`/api/get-data-of-member?id=${id}`);

      // find the selected category object
      const selected = res.data.data.find(
        (item) => item.category === decodeURIComponent(category)
      );

      setData(selected);
    };

    fetchCategories();
  }, [category, params]);

  const goToGraph = (param) => {
    router.push(
      `/test_categories/${category}/${param}?id=${params.get("id")}`
    );
  };

  return (
    <ParameterList
      category={data}
      onSelectParameter={goToGraph}
      onBack={() => router.back()}
    />
  );
}
