// components/ShareholdingPatternChart.tsx
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "./ui/button";

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface Shareholder {
  name: string;
  percentage: number;
}

interface ShareholdingPattern {
  symbol: string;
  promoters: Shareholder[];
  institutionalInvestors: Shareholder[];
  public: Shareholder[];
}

interface ShareholdingPatternChartProps {
  data: ShareholdingPattern;
}

const ShareholdingPatternChart: React.FC<ShareholdingPatternChartProps> = ({
  data,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    "promoters" | "institutionalInvestors" | "public"
  >("promoters");

  const promoters = data.promoters || [];
  const institutionalInvestors = data.institutionalInvestors || [];
  const publicShareholders = data.public || [];

  // Define a color palette using Tailwind CSS color codes
  const colorPalette = [
    "#60A5FA", // bg-blue-400
    "#4ADE80", // bg-green-400
    "#F87171", // bg-red-400
    "#FBBF24", // bg-yellow-400
    "#9CA3AF", // bg-gray-400
    "#A78BFA", // bg-indigo-400
  ];

  // Prepare data for the chart
  const chartData = {
    labels: (() => {
      switch (activeCategory) {
        case "promoters":
          return promoters.map((shareholder) => shareholder.name);
        case "institutionalInvestors":
          return institutionalInvestors.map((shareholder) => shareholder.name);
        case "public":
          return publicShareholders.map((shareholder) => shareholder.name);
      }
    })(),
    datasets: [
      {
        label: "Shareholding Pattern",
        data: (() => {
          switch (activeCategory) {
            case "promoters":
              return promoters.map((shareholder) => shareholder.percentage);
            case "institutionalInvestors":
              return institutionalInvestors.map(
                (shareholder) => shareholder.percentage
              );
            case "public":
              return publicShareholders.map(
                (shareholder) => shareholder.percentage
              );
          }
        })(),
        backgroundColor: (() => {
          switch (activeCategory) {
            case "promoters":
              return promoters.map(
                (_, index) => colorPalette[index % colorPalette.length]
              );
            case "institutionalInvestors":
              return institutionalInvestors.map(
                (_, index) =>
                  colorPalette[(index + promoters.length) % colorPalette.length]
              );
            case "public":
              return publicShareholders.map(
                (_, index) =>
                  colorPalette[
                    (index + promoters.length + institutionalInvestors.length) %
                      colorPalette.length
                  ]
              );
          }
        })(),
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options to make the chart smaller
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // Check if data is empty
  if (chartData.labels.length === 0) {
    return <p>No data available for the chart</p>;
  }

  return (
    <div className="flex">
      {/* Pie Chart */}
      <div className="w-2/3 pr-4">
        <div
          style={{ width: "100%", height: "300px" }}
          className="chart-container"
        >
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Buttons */}
      <div className="w-1/3 flex flex-col items-start space-y-2">
        <Button
          onClick={() => setActiveCategory("promoters")}
          className={`py-2 px-4 rounded ${
            activeCategory === "promoters"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Promoters
        </Button>
        <Button
          onClick={() => setActiveCategory("institutionalInvestors")}
          className={`py-2 px-4 rounded ${
            activeCategory === "institutionalInvestors"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Institutional Investors
        </Button>
        <Button
          onClick={() => setActiveCategory("public")}
          className={`py-2 px-4 rounded ${
            activeCategory === "public"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Public
        </Button>
      </div>
    </div>
  );
};

export default ShareholdingPatternChart;
