import React from 'react'
import { DollarSign, TrendingUp, Shield, BarChart, PieChart, Star } from 'lucide-react'
import RatioCard from './RatioCard'
import { Stock } from '../app/types/stock-detail'

interface RatioCardListProps {
  stock: Stock
}

export default function RatioCardList({ stock }: RatioCardListProps) {
  return (
    <>
      <h1 className="text-center text-4xl font-bold">Ratios</h1>
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-2 sm:gap-10 md:grid-cols-3">
        <RatioCard title="Book Value" value={stock.bookValue ?? 0} icon={DollarSign} />
        <RatioCard title="PE Ratio" value={stock.peRatio ?? 0} icon={BarChart} />
        <RatioCard title="Debt to Equity" value={stock.debtToEquityRatio ?? 0} icon={Shield} />
        <RatioCard title="EPS" value={stock.epsTTM ?? 0} icon={TrendingUp} />
        <RatioCard title="ROI" value={stock.roi ?? 0} icon={PieChart} />
        <RatioCard title="ROE" value={stock.roe ?? 0} icon={Star} />
      </div>
    </>
  )
}
