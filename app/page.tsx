'use client'
import React from 'react'
import { ErrorMessage } from 'formik'
import { useFetchGainersAndLosers } from './hooks/use-fetch-gainers-and-losers'
import SearchStocks from '../components/SearchStocks'
import MarketNews from '../components/MarketNews'
import Loading from '../components/Loading'
import StockCard from '../components/StockCard'
import StockCategories from '../components/StockCategories'

export default function SplashPage() {
  const {
    data: topGainersAndLosersData,
    isLoading: IsTopGainersAndLosersLoading,
    isError: topGainersAndLosersIsError,
  } = useFetchGainersAndLosers()

  const topGainers = topGainersAndLosersData?.topGainers
  const topLosers = topGainersAndLosersData?.topLosers

  if (topGainersAndLosersIsError) {
    return <ErrorMessage name={'Failed to fetch losers and gainers'} />
  }

  return (
    <div className="container mx-auto grid gap-8 overflow-x-hidden px-4 sm:px-6 md:px-8">
      {/* Search Stocks Component */}
      <SearchStocks />

      {/* Market News Component */}
      <MarketNews />

      {/* Top Gainers Section */}
      <div className="mb-4">
        <h2 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">Top Gainers</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IsTopGainersAndLosersLoading ? (
            <Loading isLoading={IsTopGainersAndLosersLoading} />
          ) : (
            topGainers?.slice(0, 5).map((stock: any) => <StockCard stock={stock} key={stock.ticker} mode={'normal'} />)
          )}
        </div>
      </div>

      {/* Top Losers Section */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Top Losers</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topLosers?.slice(0, 5).map((stock: any) => <StockCard stock={stock} key={stock.ticker} mode={'normal'} />)}
        </div>
      </div>

      {/* Stock Categories */}
      <div className="mt-10">
        <StockCategories />
      </div>
    </div>
  )
}
