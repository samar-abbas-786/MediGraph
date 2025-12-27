"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

const AllTestsPageOnCategory = () => {
  const searchParams = useSearchParams();
  const member_id = searchParams.get("id");

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!member_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/get-all-data-to-show-on-category-page?id=${member_id}`
        );

        setTests(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [member_id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
        All Tests
      </h1>

      {tests.length === 0 && (
        <p className="text-gray-500">No test data found.</p>
      )}

      {tests.map((test, index) => {
        // Sort readings safely by date
        const sortedReadings = [...(test.readings || [])].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const chartData = {
          datasets: [
            {
              label: test.parameter,
              data: sortedReadings.map((r) => ({
                x: new Date(r.date),
                y: r.value,
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
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "dd MMM yyyy",
                displayFormats: {
                  day: "dd MMM",
                },
              },
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: test.parameter,
              },
            },
          },
        };

        return (
          <div
            key={index}
            className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
              {test.parameter}
            </h2>

            <div className="overflow-x-auto">
              <div className="h-[300px] min-w-[300px]">
                <Line data={chartData} options={options} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllTestsPageOnCategory;
