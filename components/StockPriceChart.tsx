"use client";
import React, { useState } from "react";
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

const StockPriceChart: React.FC<StockPriceChartProps> = ({
  historicalData,
}) => {
  const [timeFrame, setTimeFrame] = useState<string>("1M");

  const filterData = (data: HistoricalDataEntry[], frame: string) => {
    const now = new Date();
    let filtered = [...data];

    switch (frame) {
      case "1D":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          return now.getTime() - date.getTime() <= 24 * 60 * 60 * 1000;
        });
        break;
      case "1W":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
        });
        break;
      case "1M":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
      case "1Y":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          return now.getTime() - date.getTime() <= 365 * 24 * 60 * 60 * 1000;
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredData = filterData(historicalData, timeFrame);
  const dates = filteredData.map((data) => data.date);
  const prices = filteredData.map((data) => data.close);

  const initialPrice = prices[0];
  const finalPrice = prices[prices.length - 1];
  const lineColor = finalPrice > initialPrice ? "#FF0000" : "#28c39a";

  const chartData: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Closing Price",
        data: prices,
        borderColor: lineColor,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        borderWidth: 2,
        backgroundColor:
          lineColor === "#FF0000"
            ? "rgba(255, 0, 0, 0.3)"
            : "rgba(40, 195, 154, 0.3)",
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
          onClick={() => setTimeFrame("1D")}
          className={`p-5 border rounded ${
            timeFrame === "1D"
              ? "bg-purple-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Day
        </Button>
        <Button
          onClick={() => setTimeFrame("1W")}
          className={`p-5 border rounded ${
            timeFrame === "1W"
              ? "bg-purple-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Week
        </Button>
        <Button
          onClick={() => setTimeFrame("1M")}
          className={`p-5 border rounded ${
            timeFrame === "1M"
              ? "bg-purple-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Month
        </Button>
        <Button
          onClick={() => setTimeFrame("1Y")}
          className={`p-5 border rounded ${
            timeFrame === "1Y"
              ? "bg-purple-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Year
        </Button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockPriceChart;
