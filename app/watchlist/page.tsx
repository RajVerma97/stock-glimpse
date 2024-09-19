'use client'

import ErrorMessage from '../../components/Error'
import SpinnerManager from '../../components/SpinnerManager'
import StockCard from '../../components/StockCard'
import { useGetWatchlist } from '../hooks/use-get-watch-list'
import { Stock } from '../types/stock-detail'

function Watchlist() {
  const { data, error, isLoading } = useGetWatchlist()

  if (!data && !error) return <SpinnerManager isLoading={isLoading} />

  if (error) return <ErrorMessage message={(error as Error).message} />

  const watchlist = data?.watchlist || []

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
        <p>Your watchlist is empty.</p>
      )}
    </div>
  )
}

export default Watchlist
