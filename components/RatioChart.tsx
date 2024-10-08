import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardContent, CardHeader } from './ui/card'
import { RatioData, RatioItem } from '../app/types/stock-detail'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface RatioChartProps {
  ratios: RatioData
}

export default function RatioChart({ ratios }: RatioChartProps) {
  if (!ratios || Object.keys(ratios).length === 0) {
    return <p className="text-center text-gray-500">Data not available...</p>
  }

  return (
    <div className="grid w-full grid-cols-1 gap-[3rem] sm:grid-cols-2 md:grid-cols-3">
      {Object.entries(ratios).map(([key, values], index) => {
        const data = {
          labels: (values as RatioItem[]).map((item) => item.period).reverse(),
          datasets: [
            {
              label: key,
              data: (values as RatioItem[]).map((item) => item.v).reverse(),
              borderColor: '#EC4899', // Pink-500 color for the line
              backgroundColor: 'rgba(236, 72, 153, 0.2)', // Light pink fill
              pointBackgroundColor: '#4A4A4A', // Dark gray for points
              pointBorderColor: '#ffffff', // White border for points
              pointBorderWidth: 2,
              fill: true,
            },
          ],
        }

        return (
          <Card
            key={index}
            className="flex flex-col rounded-lg border border-gray-200 bg-gray-100 p-1 text-black shadow-md"
          >
            <CardHeader className="mb-4 text-center text-2xl font-semibold uppercase">{key}</CardHeader>
            <CardContent className="relative h-[300px]">
              <Line
                data={data}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#000000', // Black color for legend text
                      },
                    },
                    tooltip: {
                      backgroundColor: '#333', // Dark background color
                      titleColor: '#ffffff', // White color for title
                      bodyColor: '#ffffff', // White color for body text
                      titleFont: {
                        size: 18, // Increased title font size
                        weight: 'bold',
                      },
                      bodyFont: {
                        size: 16, // Increased body font size
                      },
                      padding: 10, // Increased padding for better spacing
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: '#000000', // Black color for x-axis ticks
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      ticks: {
                        color: '#000000', // Black color for y-axis ticks
                      },
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
