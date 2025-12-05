"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import Loading from "@/components/loading";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AllTestsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const member_id = searchParams.get("id");
  const category = decodeURIComponent(params.category);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/api/get-all-data-of-category?id=${member_id}&category=${encodeURIComponent(
            category
          )}`
        );

        const apiData = res.data.data; // ← array format

        // Convert array to object
        const formattedData = {};
        apiData.forEach((item) => {
          formattedData[item._id] = item.values;
        });

        setData(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, member_id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
        All Tests for: {category}
      </h1>

      {Object.keys(data).length === 0 && (
        <p className="text-gray-500">No data found for this category.</p>
      )}

      {Object.keys(data).map((param, idx) => {
        const paramData = data[param];

        const labels = paramData.map((d) =>
          new Date(d.date).toLocaleDateString("en-IN")
        );
        const values = paramData.map((d) => d.value);

        const chartData = {
          labels,
          datasets: [
            {
              label: param,
              data: values,
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: true,
            },
          ],
        };

        const options = {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
        };

        return (
          <div
            key={idx}
            className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              {param}
            </h2>
            <div className="overflow-x-auto">
              <div className="min-w-[300px]">
                <Line data={chartData} options={options} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllTestsPage;
