"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Loading from "@/components/loading";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
);

const AllTestsPageClient = ({ member_id, category }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!member_id || !category) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/get-all-data-of-category?id=${member_id}&category=${encodeURIComponent(
            category,
          )}`,
        );

        const apiData = res.data?.data || [];
        console.log("API Response:", apiData);

        const formattedData = {};

        // Handle different data formats from the API
        if (Array.isArray(apiData)) {
          apiData.forEach((item) => {
            // Try different property names for the values/readings
            const values = item.values || item.readings || [];
            if (values.length > 0) {
              formattedData[item._id || item.parameter] = values;
            }
          });
        }

        console.log("Formatted Data:", formattedData);
        setData(formattedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, member_id]);

  const downloadCSV = (readings, parameter) => {
    if (!readings || readings.length === 0) return;

    const headers = ["Date", "Value"];
    const rows = readings.map((r) => [
      new Date(r.date).toLocaleDateString("en-IN"),
      r.value,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${parameter}_${category}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
        All Tests for: {category}
      </h1>

      {Object.keys(data).length === 0 && (
        <p className="text-gray-500">No data found for this category.</p>
      )}

      {Object.keys(data).map((param, idx) => {
        const paramData = [...data[param]].sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );

        // Ensure we have valid data points with date and value
        const validData = paramData.filter(
          (d) => d && d.date && typeof d.value === "number",
        );

        if (validData.length === 0) return null;

        const chartData = {
          datasets: [
            {
              label: param,
              data: validData.map((d) => ({
                x: new Date(d.date),
                y: d.value,
              })),
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
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "dd MMM yyyy",
                displayFormats: { day: "dd MMM" },
              },
              title: { display: true, text: "Date" },
            },
            y: {
              title: { display: true, text: param },
            },
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
              <div className="h-[300px] min-w-[300px]">
                <Line data={chartData} options={options} />
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => downloadCSV(validData, param)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Download CSV
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllTestsPageClient;
