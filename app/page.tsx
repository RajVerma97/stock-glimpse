'use client'
import Link from 'next/link'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import ErrorMessage from '@/components/Error'
import { useFetchGainersAndLosers } from './hooks/use-fetch-gainers-and-losers'
import SearchStocks from '@/components/SearchStocks'
import StockCard from '@/components/StockCard'
import { useFetchMarketIndex } from './hooks/use-fetch-market-index'
import StockCategories from '@/components/StockCategories'
import MarketNews from '@/components/MarketNews'
import { useFetchMarketNews } from './hooks/use-fetch-market-news'

export default function SplashPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const {
    data: topGainersAndLosersData,
    isLoading: IsTopGainersAndLosersLoading,
    isError: topGainersAndLosersIsError,
  } = useFetchGainersAndLosers()

  const topGainers = topGainersAndLosersData?.topGainers
  const topLosers = topGainersAndLosersData?.topLosers

  const {
    data: marketIndexInfo,
    isLoading: isMarketIndexInfoLoading,
    isError: isMarketIndexInfoError,
  } = useFetchMarketIndex('SPY')

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="container mx-auto px-4 grid gap-8">
      <SearchStocks />

      <div className="w-full">
        <MarketNews />
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {IsTopGainersAndLosersLoading ? (
            <Loading isLoading={IsTopGainersAndLosersLoading} />
          ) : (
            topGainers
              ?.slice(0, 5)
              .map((stock: any) => (
                <StockCard stock={stock} key={stock.ticker} />
              ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Losers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {topLosers
            ?.slice(0, 5)
            .map((stock: any) => (
              <StockCard stock={stock} key={stock.ticker} />
            ))}
        </div>
      </div>

      <div>
        <StockCategories />
      </div>
    </div>
  )
}
