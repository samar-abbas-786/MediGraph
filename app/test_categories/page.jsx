"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const Test_Category = () => {
  const params = useSearchParams();

  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [graphData, setGraphData] = useState([]);

  // STEP 1 → Fetch Categories
  useEffect(() => {
    const getData = async () => {
      const id = params.get("id");
      const response = await axios.get(`/api/get-data-of-member?id=${id}`);
      setData(response.data?.data);
    };
    getData();
  }, []);

  // STEP 3 → Fetch Graph Data when parameter clicked
  const fetchGraphData = async (category, parameter) => {
    const id = params.get("id");
    const res = await axios.get(
      `/api/get-parameter-history?id=${id}&category=${category}&parameter=${parameter}`
    );
    setGraphData(res.data.data);
  };

  return (
    <div>
      <h1>Test Category</h1>

      {/* STEP 1 → SHOW CATEGORIES */}
      {!selectedCategory &&
        data.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelectedCategory(item)}
            style={{
              cursor: "pointer",
              padding: "8px",
              border: "1px solid #ccc",
              margin: "5px",
              borderRadius: "6px",
            }}
          >
            {item.category}
          </div>
        ))}

      {/* STEP 2 → SHOW PARAMETERS */}
      {selectedCategory && !selectedParameter && (
        <>
          <h2>{selectedCategory.category}</h2>
          {selectedCategory.parameters.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedParameter(p);
                fetchGraphData(selectedCategory.category, p);
              }}
              style={{
                cursor: "pointer",
                padding: "8px",
                border: "1px solid #aaa",
                margin: "5px",
                borderRadius: "6px",
              }}
            >
              {p}
            </div>
          ))}

          <button onClick={() => setSelectedCategory(null)}>Back</button>
        </>
      )}

      {/* STEP 3 → SHOW GRAPH */}
      {selectedParameter && (
        <>
          <h2>{selectedParameter} Graph</h2>

          {/* graphData contains {value, date} → you can plug into recharts */}
          <pre>{JSON.stringify(graphData, null, 2)}</pre>

          <button onClick={() => setSelectedParameter(null)}>Back</button>
        </>
      )}
    </div>
  );
};

export default Test_Category;
