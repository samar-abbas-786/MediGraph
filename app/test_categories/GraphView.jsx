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
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div>
      <h2>
        {parameter} — Graph ({category})
      </h2>

      <Line data={data} options={options} />

      <button onClick={onBack} style={styles.backBtn}>
        Back
      </button>
    </div>
  );
};

const styles = {
  backBtn: {
    marginTop: "10px",
    padding: "6px 12px",
  },
};

export default GraphView;
