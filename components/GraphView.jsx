"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const GraphView = ({ category, parameter, graphData, onBack }) => {
  // Convert data → chart format
  const labels = graphData.map((item) =>
    new Date(item.date).toLocaleDateString("en-IN")
  );
  const values = graphData.map((item) => item.value);

  const data = {
    labels,
    datasets: [
      {
        label: `${parameter} Value`,
        data: values,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 13, weight: "500" },
          color: "#374151",
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          {parameter} — Graph
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">{category}</p>
      </div>

      {/* Chart Container */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-3 sm:p-6 rounded-lg mb-4 sm:mb-6 shadow-inner overflow-x-auto">
        <div className="min-w-[300px]">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        ← Back
      </button>
    </div>
  );
};

export default GraphView;
