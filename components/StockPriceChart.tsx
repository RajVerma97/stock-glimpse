"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Button } from "./ui/button";
import { MoonLoader } from "react-spinners";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

interface HistoricalDataEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockPriceChartProps {
  historicalData: HistoricalDataEntry[];
}

const StockPriceChart = ({ historicalData }: StockPriceChartProps) => {
  const [timeFrame, setTimeFrame] = useState<string>("1M");
  const [filteredData, setFilteredData] = useState<HistoricalDataEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    const now = new Date();
    let startDate: Date;

    switch (timeFrame) {
      case "1D":
        startDate = subDays(now, 1);
        break;
      case "1W":
        startDate = subDays(now, 7);
        break;
      case "1M":
        startDate = subMonths(now, 1);
        break;
      case "1Y":
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subYears(now, 1);
    }

    const filtered = historicalData.filter((entry) => {
      try {
        const entryDate = parseISO(entry.date);
        return isValid(entryDate) && entryDate >= startDate;
      } catch {
        return false;
      }
    });

    setFilteredData(filtered);

    setLoading(false);
  }, [timeFrame, historicalData]);

  const dates = filteredData.map((data) => data.date || "N/A");
  const prices = filteredData.map((data) => data.close || 0);

  const initialPrice = prices[0] || 0;
  const finalPrice = prices[prices.length - 1] || 0;
  const lineColor = finalPrice > initialPrice ? "#10B981" : "#EC4899";

  const chartData: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Closing Price",
        data: prices,
        borderColor: lineColor,
        pointRadius: timeFrame === "1Y" ? 1 : 2,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#fff",
        pointBorderWidth: timeFrame === "1Y" ? 1 : 2,
        borderWidth: 2,
        backgroundColor:
          lineColor === "#10B981"
            ? "rgba(16, 185, 129, 0.3)"
            : "rgba(236, 72, 96, 0.3)",
        fill: true,
        tension: 0.5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: "Stock Price History",
        color: "white",
        font: {
          size: 20,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number;
            return `$${value.toFixed(2)}`;
          },
        },
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
        caretSize: 6,
        cornerRadius: 4,
        padding: 10,
        backgroundColor: "#333",
        borderColor: "#fff",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          callback: (value) => `$${value}`,
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  return (
    <div className="w-full h-[500px] p-4">
      <div className="mb-4 flex space-x-2">
        <Button
          onClick={() => setTimeFrame("1W")}
          className={`py-3 px-6 text-lg rounded-md ${
            timeFrame === "1W"
              ? "bg-indigo-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Week
        </Button>
        <Button
          onClick={() => setTimeFrame("1M")}
          className={`py-3 px-6 text-lg rounded-md ${
            timeFrame === "1M"
              ? "bg-indigo-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Month
        </Button>
        <Button
          onClick={() => setTimeFrame("1Y")}
          className={`py-3 px-6 text-lg rounded-md ${
            timeFrame === "1Y"
              ? "bg-indigo-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Year
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <MoonLoader color="#36d7b7" size={50} />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};
export default StockPriceChart;
