import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useChartData from "./useChartData";
import Loading from "@/components/shared/Loading";

// Register necessary components
Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const DeviationLineChart = ({ isDemo = false }) => {
  // Demo data
  const demoDeviations = [
    { month: "January", deviation: 1 },
    { month: "February", deviation: -2 },
    { month: "March", deviation: 0 },
    { month: "April", deviation: 3 },
    { month: "May", deviation: -1 },
    { month: "June", deviation: 2 },
    { month: "July", deviation: 0 },
    { month: "August", deviation: -3 },
    { month: "September", deviation: 1 },
    { month: "October", deviation: 2 },
    { month: "November", deviation: -2 },
    { month: "December", deviation: 0 },
  ];

  const { deviations } = useChartData();

  // Decide whether to use demo data or real data
  const activeDeviations = isDemo ? demoDeviations : deviations;

  // Prepare labels and data from deviations
  const labels = activeDeviations.map((item) => item.month); // Extract month names
  const dataPoints = activeDeviations.map((item) => item.deviation); // Extract deviations

  const chartData = {
    labels, // Labels for X-axis
    datasets: [
      {
        label: "Deviation = Actual Start Day - Expected Start Day",
        data: dataPoints,
        borderColor: "#4f46e5", // Line color
        backgroundColor: "rgba(79, 70, 229, 0.3)", // Fill under the line
        tension: 0.4, // Smoothing for the line
        pointRadius: 5, // Size of points
        pointBackgroundColor: "#4f46e5", // Point color
        pointBorderColor: "#ffffff", // Point border color
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Cycle Start Day Deviations (Last 12 Months)",
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          pointStyle: "circle", // Specifies the style, default is 'rectangular' shape
          usePointStyle: true, // Enables the use of the specified pointStyle
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Deviation (Days)",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure step size is 1
          callback: function (value) {
            return Number.isInteger(value) ? value : null; // Remove decimals
          },
        },
      },
    },
    responsive: true, // Ensure responsiveness
    maintainAspectRatio: true, // Maintain dynamic aspect ratio
  };

  return <Line data={chartData} options={options} />;
};

export default DeviationLineChart;
