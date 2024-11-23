'use client'
import React, { Suspense } from 'react'
import { ErrorMessage } from 'formik'
import { useFetchGainersAndLosers } from './hooks/use-fetch-gainers-and-losers'
import SearchStocks from '../components/SearchStocks'
import MarketNews from '../components/MarketNews'
import StockCard from '../components/StockCard'
import StockCategories from '../components/StockCategories'
import Skeleton from '../components/Skeleton'

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
      <SearchStocks />

      <MarketNews />

      <div className="mb-4">
        <h2 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">Top Gainers</h2>
        <Suspense fallback={<Skeleton height="10rem" className="w-80" />}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {IsTopGainersAndLosersLoading
              ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} height="10rem" className="w-80" />)
              : topGainers
                  ?.slice(0, 5)
                  .map((stock: any) => <StockCard stock={stock} key={stock.ticker} mode={'normal'} />)}
          </div>
        </Suspense>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Top  Losers</h2>
        <Suspense fallback={<Skeleton height="10rem" className="w-80" />}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {IsTopGainersAndLosersLoading
              ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} height="10rem" className="w-80" />)
              : topLosers
                  ?.slice(0, 5)
                  .map((stock: any) => <StockCard stock={stock} key={stock.ticker} mode={'normal'} />)}
          </div>
        </Suspense>
      </div>

      <div className="mt-10">
        <StockCategories />
      </div>
    </div>
  )
}
