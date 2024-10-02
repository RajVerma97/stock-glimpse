'use client'

import Lottie from 'lottie-react'
import { Suspense } from 'react'
import ErrorMessage from '../../components/Error'
import SpinnerManager from '../../components/SpinnerManager'
import StockCard from '../../components/StockCard'
import { useGetWatchlist } from '../hooks/use-get-watch-list'
import { Stock } from '../types/stock-detail'
import Skeleton from '../../components/Skeleton'

function Watchlist() {
  const { data, error, isLoading } = useGetWatchlist()

  const watchlist = data?.watchlist || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: Math.max(6, watchlist || 0) }).map((_, index) => (
          <Skeleton key={index} width="100%" height="150px" className="rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) return <ErrorMessage message={(error as Error).message} />

  return (
    <div>
      <h1 className="mb-4 text-center text-2xl">Your Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((stock: Stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Lottie animationData={require('../../public/watchlist-empty.json')} loop={true} className="h-96 w-96" />
          <p className="text-white-600 mt-4">Your watchlist is empty.</p>
        </div>
      )}
    </div>
  )
}

function WatchlistWrapper() {
  return (
    <Suspense fallback={<SpinnerManager isLoading={true} />}>
      <Watchlist />
    </Suspense>
  )
}

export default WatchlistWrapper
