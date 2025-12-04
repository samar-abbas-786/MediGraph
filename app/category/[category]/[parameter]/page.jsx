"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import axios from "axios";
import GraphView from "../../../../components/GraphView";

export default function GraphPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { category, parameter } = useParams();
  console.log("PArams", parameter);
  const [graphData, setGraphData] = useState([]);
  const decodedParameter = decodeURIComponent(parameter);
  useEffect(() => {
    const fetchGraphData = async () => {
      const id = params.get("id");
      const res = await axios.get(
        `/api/get-parameter-history?id=${id}&category=${category}&parameter=${parameter}`
      );
      setGraphData(res.data.data || []);
    };

    fetchGraphData();
  }, [category, parameter, params]);

  return (
    <GraphView
      category={category}
      parameter={decodedParameter}
      graphData={graphData}
      onBack={() => router.back()}
    />
  );
}
