import React from 'react'
import Image from 'next/image'
import { HeartIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useAddToWatchListMutation } from '../app/hooks/use-add-to-watchlist'
import { Card, CardHeader } from './ui/card'
import { Stock } from '../app/types/stock-detail'
import { ToastManager } from './ToastManager'

export default function FundamentalCard({ stock }: { stock: Stock }) {
  const addToWatchListMutation = useAddToWatchListMutation()

  const handleAddToWatchList = () => {
    addToWatchListMutation.mutate(stock)
  }

  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-lg">
      <Card className="mb-6 w-full rounded-lg border bg-white p-6">
        <CardHeader className="mb-6">
          <div className="mb-4 flex items-center space-x-4">
            {stock.logo && (
              <Image
                src={stock.logo}
                alt={`${stock.companyName} logo`}
                className="h-16 w-16 rounded-full border"
                width={64}
                height={64}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-black">
                {stock.companyName} ({stock.symbol})
              </h1>
              <p className="text-lg text-gray-500">Industry: {stock.industry}</p>
              <p className="mt-2 text-lg text-gray-600">
                Current Price: <span className="font-semibold text-green-500">${stock.currentPrice}</span>
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddToWatchList}
            className="mt-8 flex w-full items-center justify-center rounded-lg border-2 bg-black px-6 py-5 text-white transition-all duration-300 ease-in-out hover:bg-indigo-500 hover:text-white hover:shadow-lg"
          >
            <HeartIcon className="mr-2 h-5 w-5" />
            <span className="font-semibold">Add to Watchlist</span>
          </Button>
        </CardHeader>

        {/* Grid layout for stock fundamentals */}
        <div className="grid grid-cols-2 gap-6 p-1">
          <StockDetail
            label="Change"
            value={`${stock.change ?? '0'} (${stock.previousClosePrice ? (stock.currentPrice - stock.previousClosePrice).toFixed(2) : '0'})`}
            positive={!!(stock.change && stock.change > 0)}
          />
          <StockDetail label="Percentage Change" value={`${stock.percentageChange?.toString() ?? 'N/A'}%`} />
          <StockDetail label="High Price of Day" value={`$${stock.highPriceOfDay?.toString() ?? 'N/A'}`} />
          <StockDetail label="Low Price of Day" value={`$${stock.lowPriceOfDay?.toString() ?? 'N/A'}`} />
          <StockDetail label="Opening Price" value={`$${stock.openingPrice?.toString() ?? 'N/A'}`} />
          <StockDetail label="Previous Close Price" value={`$${stock.previousClosePrice?.toString() ?? 'N/A'}`} />
          <StockDetail label="Country" value={stock.country ?? 'N/A'} />
          <StockDetail label="Market Cap" value={stock.marketCap?.toString() ?? 'N/A'} />
          <StockDetail label="PE Ratio" value={stock.peRatio?.toString() ?? 'N/A'} />
          <StockDetail label="Dividend Yield" value={stock.dividendYield?.toString() ?? 'N/A'} />
        </div>
      </Card>
      <ToastManager />
    </div>
  )
}

function StockDetail({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg text-gray-400">{label}:</span>
      <span className={`text-lg font-semibold ${positive ? 'text-green-500' : 'text-gray-500'}`}>{value}</span>
    </div>
  )
}
