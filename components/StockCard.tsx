import React, { useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Trash2Icon } from 'lucide-react'
import { Button } from './ui/button'
import SpinnerManager from './SpinnerManager'
import { useRemoveFromWatchlist } from '../app/hooks/use-remove-from-watchlist'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { notify } from './ToastManager'

interface StockCardProps {
  stock: any
  mode?: 'compact' | 'normal'
}

export default function StockCard({ stock, mode }: StockCardProps) {
  const pathName = usePathname()
  const { mutate, status } = useRemoveFromWatchlist(stock.symbol)

  const handleRemoveFromWatchlist = useCallback(() => {
    mutate(stock.symbol, {
      onSuccess: () => {
        notify({ status: 'success', message: 'Stock removed from watchlist successfully.' })
      },
      onError: () => {
        notify({ status: 'error', message: 'Failed to remove stock from watchlist.' })
      },
    })
  }, [stock.symbol, mutate])

  const CardContentComponent = useMemo(
    () => (
      <CardContent className="flex items-center justify-between">
        <p className="text-lg font-medium text-gray-800">
          ${typeof stock.currentPrice === 'number' ? stock.currentPrice.toFixed(2) : 'N/A'}
        </p>
        {pathName === '/watchlist' ? (
          <Button
            onClick={handleRemoveFromWatchlist}
            className="text-red-500"
            variant="secondary"
            disabled={status === 'pending'}
            aria-label={`Remove ${stock.companyName} from watchlist`}
          >
            {status === 'pending' ? <SpinnerManager isLoading /> : <Trash2Icon />}
          </Button>
        ) : mode === 'normal' ? (
          <p className={`text-lg font-semibold ${stock.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change}%
          </p>
        ) : null}
      </CardContent>
    ),
    [pathName, stock.currentPrice, stock.change, handleRemoveFromWatchlist, status, mode, stock.companyName],
  )

  const CardComponent = (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-lg"
    >
      <Card className="cursor-pointer rounded-lg border bg-white p-4 shadow-md">
        <CardHeader className="mb-2 flex items-center border-b pb-2">
          <Image
            width={100}
            height={100}
            src={stock?.logo}
            alt={`${stock.companyName} logo`}
            className="mr-4 h-16 w-16 rounded-full" // Use object-contain or object-cover
          />
          <CardTitle className="truncate text-xl font-semibold text-gray-900">{stock.companyName}</CardTitle>
        </CardHeader>
        {CardContentComponent}
      </Card>
    </motion.div>
  )

  return pathName === '/watchlist' && status === 'pending' ? (
    <SpinnerManager isLoading={true} />
  ) : (
    <Link href={`/stock-detail/${stock.symbol}`} className="block">
      {CardComponent}
    </Link>
  )
}
