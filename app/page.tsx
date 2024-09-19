'use client'
import React from 'react'
import { ErrorMessage } from 'formik'
import { useFetchGainersAndLosers } from './hooks/use-fetch-gainers-and-losers'
import SearchStocks from '../components/SearchStocks'
import MarketNews from '../components/MarketNews'
import Loading from '../components/Loading'
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
    ;<ErrorMessage name={'Failed to fetch losers and gainers'} />
  }

  return (
    <div className="container mx-auto grid gap-8 px-4">
      <SearchStocks />

      <div className="w-full">
        <MarketNews />
      </div>

      <div className="mb-4">
        <h2 className="mb-4 text-2xl font-semibold">Top Gainers</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {IsTopGainersAndLosersLoading ? (
            <Loading isLoading={IsTopGainersAndLosersLoading} />
          ) : (
            topGainers?.slice(0, 5).map((stock: any) => <StockCard stock={stock} key={stock.ticker} />)
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Top Losers</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {topLosers?.slice(0, 5).map((stock: any) => <StockCard stock={stock} key={stock.ticker} />)}
        </div>
      </div>

      <div>
        <StockCategories />
      </div>
    </div>
  )
}
