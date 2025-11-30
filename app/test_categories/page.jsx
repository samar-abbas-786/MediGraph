"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import CategoryList from "./CategoryList";
import ParameterList from "./ParameterList";
import GraphView from "./GraphView";

const Test_Category = () => {
  const params = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [graphData, setGraphData] = useState([]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      const id = params.get("id");
      const response = await axios.get(`/api/get-data-of-member?id=${id}`);
      setCategories(response.data?.data || []);
    };
    fetchCategories();
  }, []);

  // Fetch graph data for selected parameter
  const fetchGraphData = async (category, parameter) => {
    const id = params.get("id");
    const res = await axios.get(
      `/api/get-parameter-history?id=${id}&category=${category}&parameter=${parameter}`
    );
    setGraphData(res.data.data || []);
  };

  return (
    <div>
      {/* STEP 1 → CATEGORY LIST */}
      {!selectedCategory && (
        <CategoryList
          data={categories}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* STEP 2 → PARAMETER LIST */}
      {selectedCategory && !selectedParameter && (
        <ParameterList
          category={selectedCategory}
          onSelectParameter={(param) => {
            setSelectedParameter(param);
            fetchGraphData(selectedCategory.category, param);
          }}
          onBack={() => setSelectedCategory(null)}
        />
      )}

      {/* STEP 3 → GRAPH VIEW */}
      {selectedParameter && (
        <GraphView
          category={selectedCategory.category}
          parameter={selectedParameter}
          graphData={graphData}
          onBack={() => setSelectedParameter(null)}
        />
      )}
    </div>
  );
};

export default Test_Category;
