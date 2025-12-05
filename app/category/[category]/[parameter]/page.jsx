"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import axios from "axios";
import GraphView from "../../../../components/GraphView";
import Loading from "@/components/loading";


export default function GraphPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { category, parameter } = useParams();
  const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(false);

  const decodedParameter = decodeURIComponent(parameter);
  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true)
      const id = params.get("id");
      const res = await axios.get(
        `/api/get-parameter-history?id=${id}&category=${category}&parameter=${parameter}`
      );
      setGraphData(res.data.data || []);
      setLoading(false)
    };

    fetchGraphData();
  }, [category, parameter, params]);
    if (loading) {
      return <Loading />;
    }
  return (
    <GraphView
      category={category}
      parameter={decodedParameter}
      graphData={graphData}
      onBack={() => router.back()}
    />
  );
}
