import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "./ui/button";

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

  const colorPalette = [
    "#60A5FA",
    "#4ADE80",
    "#F87171",
    "#FBBF24",
    "#9CA3AF",
    "#A78BFA",
  ];

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

  if (chartData.labels.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No data available for the chart
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 overflow-x-hidden">
      {/* Chart Container */}
      <div className="flex-1">
        <div className="chart-container shadow-lg rounded-lg border border-gray-200 h-[400px] lg:h-[600px]">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col space-y-2 lg:space-y-4 w-full lg:w-auto">
        <Button
          onClick={() => setActiveCategory("promoters")}
          className={`py-2 px-4 rounded-md text-white ${
            activeCategory === "promoters"
              ? "bg-blue-500"
              : "bg-white text-black border border-gray-300"
          }`}
        >
          Promoters
        </Button>
        <Button
          onClick={() => setActiveCategory("institutionalInvestors")}
          className={`py-2 px-4 rounded-md text-white ${
            activeCategory === "institutionalInvestors"
              ? "bg-blue-500"
              : "bg-white text-black border border-gray-300"
          }`}
        >
          Institutional Investors
        </Button>
        <Button
          onClick={() => setActiveCategory("public")}
          className={`py-2 px-4 rounded-md text-white ${
            activeCategory === "public"
              ? "bg-blue-500"
              : "bg-white text-black border border-gray-300"
          }`}
        >
          Public
        </Button>
      </div>
    </div>
  );
};

export default ShareholdingPatternChart;
