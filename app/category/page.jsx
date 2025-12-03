"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import CategoryList from "../../components/CategoryList";

export default function CategoryPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const id = params.get("id");
      const res = await axios.get(`/api/get-data-of-member?id=${id}`);
      setCategories(res.data.data || []);
    };
    fetchCategories();
  }, [params]);

  const handleSelectCategory = (item) => {
    const id = params.get("id");
    router.push(`/category/${item.category}?id=${id}`);
  };

  return (
    <CategoryList data={categories} onSelectCategory={handleSelectCategory} />
  );
}
