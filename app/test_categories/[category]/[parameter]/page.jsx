"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import GraphView from "@/components/GraphView";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function GraphPage() {
  const { category, parameter } = useParams();
  const params = useSearchParams();
  const router = useRouter();

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      const id = params.get("id");

      const res = await axios.get(
        `/api/get-parameter-history?id=${id}&category=${category}&parameter=${parameter}`
      );

      setGraphData(res.data.data);
    };

    fetchGraph();
  }, [category, parameter, params]);

  return (
    <GraphView
      category={category}
      parameter={parameter}
      graphData={graphData}
      onBack={() => router.back()}
    />
  );
}
