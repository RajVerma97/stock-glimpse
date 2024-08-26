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
import { MoonLoader } from "react-spinners"; // Add a spinner for loading

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
  initialTimeFrame: string;
}

const StockPriceChart = ({ initialTimeFrame }: StockPriceChartProps) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataEntry[]>(
    []
  );
  const [timeFrame, setTimeFrame] = useState<string>(initialTimeFrame);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistoricalData = async (timeFrame: string) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stockData?timeFrame=${timeFrame}`);
        const data = await response.json();
        setHistoricalData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData(timeFrame);
  }, [timeFrame]);

  const filterData = (data: HistoricalDataEntry[], frame: string) => {
    const now = new Date();

    let filtered = [...data];

    switch (frame) {
      case "1D":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
          );
        });
        break;
      case "1W":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        });
        break;
      case "1M":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
        });
        break;
      case "1Y":
        filtered = data.filter((item) => {
          const date = new Date(item.date);
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 365;
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
          className={`py-3 px-6 text-lg rounded-md ${
            timeFrame === "1D"
              ? "bg-indigo-500 text-white"
              : "bg-white text-black"
          }`}
        >
          1 Day
        </Button>
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
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default StockPriceChart;
