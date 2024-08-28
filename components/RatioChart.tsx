import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
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
} from "chart.js";
import { RatioData, RatioItem } from "@/app/types/stock-detail";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RatioChartProps {
  ratios: RatioData;
}

export default function RatioChart({ ratios }: RatioChartProps) {
  if (!ratios || Object.keys(ratios).length === 0) {
    return <p>Data not available...</p>;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2">
      {Object.entries(ratios).map(([key, values], index) => {
        const data = {
          labels: (values as RatioItem[]).map((item) => item.period).reverse(),
          datasets: [
            {
              label: key,
              data: (values as RatioItem[]).map((item) => item.v).reverse(),
              borderColor: "#00aaff",
              backgroundColor: "rgba(0, 170, 255, 0.2)",
              pointBackgroundColor: "#00aaff",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              fill: true,
            },
          ],
        };

        return (
          <Card key={index} className="mb-4 glass-effect">
            <CardHeader className="text-center text-2xl uppercase text-white">
              {key}
            </CardHeader>
            <CardContent className="chart-container">
              <Line
                data={data}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        color: "#ffffff",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "#ffffff",
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      ticks: {
                        color: "#ffffff",
                      },
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
                height={200}
                width={400}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
