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
    <div className="rounded-lg bg-indigo-500 p-6 shadow-md">
      <Card className="mb-6 w-full rounded-lg border bg-white p-6">
        <CardHeader>
          <div className="mb-6 flex items-center">
            {stock.logo && (
              <Image
                src={stock.logo}
                alt={`${stock.companyName} logo`}
                className="mr-4 h-16 w-16"
                width={64}
                height={64}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-[#f0f0f0]">
                {stock.companyName} ({stock.symbol})
              </h1>
              <p className="text-lg text-gray-400">
                Current Price: <span className="font-semibold text-green-500">${stock.currentPrice}</span>
              </p>
              <p className="text-base text-gray-500">Industry: {stock.industry}</p>
            </div>
          </div>
          <Button
            onClick={handleAddToWatchList}
            className="mb-4 flex items-center justify-center rounded-md border border-blue-400 bg-transparent px-4 py-2 text-blue-400 transition duration-200 ease-in-out hover:bg-blue-400 hover:text-white"
          >
            <HeartIcon className="mr-2 text-pink-400" />
            <span className="text-lg font-semibold">Add to Watchlist</span>
          </Button>
        </CardHeader>
        <div className="grid grid-cols-1 gap-6 text-[#e0e0e0] md:grid-cols-2">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Change:</span>
              <span className={stock.change && stock.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {stock.change ?? 0} ($
                {stock.previousClosePrice ? (stock.currentPrice - stock.previousClosePrice).toFixed(2) : 0})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Percentage Change:</span>
              <span>{stock.percentageChange}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">High Price of Day:</span>
              <span>${stock.highPriceOfDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Low Price of Day:</span>
              <span>${stock.lowPriceOfDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Opening Price:</span>
              <span>${stock.openingPrice}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Previous Close Price:</span>
              <span>${stock.previousClosePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Country:</span>
              <span>{stock.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Market Cap:</span>
              <span>{stock.marketCap ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">PE Ratio:</span>
              <span>{stock.peRatio ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Dividend Yield:</span>
              <span>{stock.dividendYield ?? 'N/A'}</span>
            </div>
          </div>
        </div>
      </Card>
      <ToastManager />
    </div>
  )
}
