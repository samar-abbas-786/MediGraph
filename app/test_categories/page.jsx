"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoryList from "@/components/CategoryList";
import { useRouter, useSearchParams } from "next/navigation";

export default function TestCategories() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      const id = params.get("id");
      const res = await axios.get(`/api/get-data-of-member?id=${id}`);
      setCategories(res.data.data);
    };
    fetchCategories();
  }, [params]);

  const goToParameters = (item) => {
    router.push(`/test_categories/${item.category}?id=${params.get("id")}`);
  };

  return <CategoryList data={categories} onSelectCategory={goToParameters} />;
}
