import React, { useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Button } from './ui/button'
import { ShareholdingPattern } from '../app/types/stock-detail'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ShareholdingPatternChartProps {
  data: ShareholdingPattern
}

const ShareholdingPatternChart: React.FC<ShareholdingPatternChartProps> = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState<'promoters' | 'institutionalInvestors' | 'public'>('promoters')

  const promoters = data.promoters || []
  const institutionalInvestors = data.institutionalInvestors || []
  const publicShareholders = data.public || []

  const colorPalette = [
    '#4F46E5', // Indigo
    '#10B981', // Green
    '#F97316', // Orange
    '#EC4899', // Pink
    '#FBBF24', // Yellow
    '#6366F1', // Blue
  ]

  const chartData = {
    labels: (() => {
      switch (activeCategory) {
        case 'promoters':
          return promoters.map((shareholder) => shareholder.name)
        case 'institutionalInvestors':
          return institutionalInvestors.map((shareholder) => shareholder.name)
        case 'public':
          return publicShareholders.map((shareholder) => shareholder.name)
      }
    })(),
    datasets: [
      {
        label: 'Shareholding Pattern',
        data: (() => {
          switch (activeCategory) {
            case 'promoters':
              return promoters.map((shareholder) => shareholder.percentage)
            case 'institutionalInvestors':
              return institutionalInvestors.map((shareholder) => shareholder.percentage)
            case 'public':
              return publicShareholders.map((shareholder) => shareholder.percentage)
          }
        })(),
        backgroundColor: (() => {
          switch (activeCategory) {
            case 'promoters':
              return promoters.map((_, index) => colorPalette[index % colorPalette.length])
            case 'institutionalInvestors':
              return institutionalInvestors.map(
                (_, index) => colorPalette[(index + promoters.length) % colorPalette.length],
              )
            case 'public':
              return publicShareholders.map(
                (_, index) =>
                  colorPalette[(index + promoters.length + institutionalInvestors.length) % colorPalette.length],
              )
          }
        })(),
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`
          },
        },
      },
    },
  }

  if (chartData.labels.length === 0) {
    return <p className="text-center text-gray-600">No data available for the chart</p>
  }

  return (
    <div className="grid gap-5 rounded-lg border border-gray-300 p-8 shadow-lg">
      <div className="flex-1">
        <div className="chart-container" style={{ height: '380px' }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
        <Button
          onClick={() => setActiveCategory('promoters')}
          className={`rounded-md p-5 text-lg text-white ${
            activeCategory === 'promoters' ? 'bg-indigo-500' : 'border-gray-300 bg-white text-black'
          } transition-transform duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg`}
        >
          Promoters
        </Button>
        <Button
          onClick={() => setActiveCategory('institutionalInvestors')}
          className={`rounded-md p-5 text-lg text-white ${
            activeCategory === 'institutionalInvestors' ? 'bg-indigo-500' : 'border-gray-300 bg-white text-black'
          } transition-transform duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg`}
        >
          Institutional Investors
        </Button>
        <Button
          onClick={() => setActiveCategory('public')}
          className={`rounded-md p-5 text-lg text-white ${
            activeCategory === 'public' ? 'bg-indigo-500' : 'border-gray-300 bg-white text-black'
          } transition-transform duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg`}
        >
          Public
        </Button>
      </div>
    </div>
  )
}

export default ShareholdingPatternChart
