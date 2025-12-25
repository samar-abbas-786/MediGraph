"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const AllTestsPageOnCategory = () => {
  const searchParams = useSearchParams();
  const member_id = searchParams.get("id");

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/api/get-all-data-to-show-on-category-page?id=${member_id}`
        );

        setTests(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (member_id) fetchData();
  }, [member_id]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
        All Tests
      </h1>

      {tests.length === 0 && (
        <p className="text-gray-500">No test data found.</p>
      )}

      {tests.map((test, idx) => {
        const values = test.readings.map((r) => r.value);

        // Since API does not return dates yet
        const labels = test.readings.map((_, i) => `Reading ${i + 1}`);

        const chartData = {
          labels,
          datasets: [
            {
              label: test.parameter,
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
          scales: {
            x: {
              title: {
                display: true,
                text: "Readings",
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
            key={idx}
            className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              {test.parameter}
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

export default AllTestsPageOnCategory;
