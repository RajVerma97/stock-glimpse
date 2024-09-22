'use client'
import React, { useState, useEffect } from 'react'
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
  ChartOptions,
  ChartData,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { MoonLoader } from 'react-spinners'
import dayjs from 'dayjs'
import { Button } from './ui/button'
import { TimeFrame } from '../app/enums/StockPriceChart.enum'
import { HistoricalDataEntry } from '../app/types/stock-detail'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin)

interface StockPriceChartProps {
  historicalData: HistoricalDataEntry[]
  timeFrame: string
  setTimeFrame: (timeFrame: string) => void
}

const StockPriceChart = ({ historicalData, timeFrame, setTimeFrame }: StockPriceChartProps) => {
  const [filteredData, setFilteredData] = useState<HistoricalDataEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const now = dayjs()
    let startDate: dayjs.Dayjs

    switch (timeFrame) {
      case TimeFrame.OneDay:
        startDate = dayjs().subtract(1, 'day')
        break
      case TimeFrame.OneWeek:
        startDate = dayjs().subtract(1, 'week')
        break
      case TimeFrame.OneMonth:
        startDate = dayjs().subtract(1, 'month')
        break
      case TimeFrame.OneYear:
        startDate = dayjs().subtract(1, 'year')
        break
      default:
        startDate = dayjs()
    }

    const filtered = historicalData.filter((entry) => {
      const entryDate = dayjs(entry.date)
      return (
        (entryDate.isAfter(startDate) && entryDate.isBefore(now)) ||
        entryDate.isSame(startDate) ||
        entryDate.isSame(now)
      )
    })

    setFilteredData(filtered)

    setLoading(false)
  }, [historicalData, timeFrame])

  const dates = filteredData.map((data) => data.date || 'N/A')
  const prices = filteredData.map((data) => data.close || 0)

  const initialPrice = prices[0] || 0
  const finalPrice = prices[prices.length - 1] || 0
  const lineColor = finalPrice > initialPrice ? '#10B981' : '#EC4899'

  const chartData: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        label: 'Closing Price',
        data: prices,
        borderColor: lineColor,
        pointRadius: timeFrame === TimeFrame.OneYear ? 1 : 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#fff',
        pointBorderWidth: timeFrame === TimeFrame.OneYear ? 1 : 2,
        borderWidth: 2,
        backgroundColor: lineColor === '#10B981' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(236, 72, 96, 0.3)',
        fill: true,
        tension: 0.5,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: 'Stock Price History',
        color: 'white',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number
            return `$${value.toFixed(2)}`
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
        backgroundColor: '#333',
        borderColor: '#fff',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          callback: (value) => `$${value}`,
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  }

  return (
    <div className="h-[450px] w-full sm:h-[500px]">
      <div className="mb-4 flex space-x-2">
        <Button
          onClick={() => setTimeFrame(TimeFrame.OneWeek)}
          className={`rounded-md px-6 py-3 text-lg transition-colors duration-300 ${
            timeFrame === TimeFrame.OneWeek
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-black hover:bg-indigo-500 hover:text-white'
          }`}
        >
          1 Week
        </Button>
        <Button
          onClick={() => setTimeFrame(TimeFrame.OneMonth)}
          className={`rounded-md px-6 py-3 text-lg transition-colors duration-300 ${
            timeFrame === TimeFrame.OneMonth
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-black hover:bg-indigo-500 hover:text-white'
          }`}
        >
          1 Month
        </Button>
        <Button
          onClick={() => setTimeFrame(TimeFrame.OneYear)}
          className={`rounded-md px-6 py-3 text-lg transition-colors duration-300 ${
            timeFrame === TimeFrame.OneYear
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-black hover:bg-indigo-500 hover:text-white'
          }`}
        >
          1 Year
        </Button>
      </div>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <MoonLoader color="#36d7b7" size={50} />
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  )
}
export default StockPriceChart
