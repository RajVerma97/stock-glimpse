import React from 'react'
import {
  DollarSign,
  TrendingUp,
  Shield,
  BarChart,
  PieChart,
  Star,
} from 'lucide-react'
import RatioCard from './RatioCard'

export default function RatioCardList({ stock }) {
  return (
    <div className="w-full p- grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
      <RatioCard title="Book Value" value={stock.bookValue} icon={DollarSign} />
      <RatioCard title="PE Ratio" value={stock.peRatio} icon={BarChart} />
      <RatioCard
        title="Debt to Equity"
        value={stock.debtToEquityRatio}
        icon={Shield}
      />
      <RatioCard title="EPS" value={stock.epsTTM} icon={TrendingUp} />
      <RatioCard title="ROI" value={stock.roi} icon={PieChart} />
      <RatioCard title="ROE" value={stock.roe} icon={Star} />
    </div>
  )
}
