import React, { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Trash2Icon } from 'lucide-react'
import { Button } from './ui/button'
import SpinnerManager from './SpinnerManager'
import { useRemoveFromWatchlist } from '../app/hooks/use-remove-from-watchlist'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
interface StockCardProps {
  stock: any
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const pathName = usePathname()
  const { mutate, status } = useRemoveFromWatchlist(stock.symbol)

  const handleRemoveFromWatchlist = useMemo(() => {
    mutate(stock.symbol)
  }, [mutate, stock.symbol])

  const CardContentComponent = useMemo(
    () => (
      <CardContent className="flex items-center justify-between">
        <p className="text-lg font-medium text-gray-800">${stock.currentPrice}</p>

        {pathName === '/watchlist' ? (
          <Button
            onClick={() => handleRemoveFromWatchlist}
            className="text-red-500"
            variant={'secondary'}
            disabled={status === 'pending'} // Disable button while loading
          >
            <Trash2Icon />
          </Button>
        ) : (
          <p className={`text-lg font-semibold ${stock.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change}%
          </p>
        )}
      </CardContent>
    ),
    [pathName, stock.currentPrice, stock.change, handleRemoveFromWatchlist, status],
  )

  const CardComponent = (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
        color: '',
        backgroundColor: 'blue',
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
            alt={`${stock.name} logo`}
            className="mr-4 h-16 w-16 rounded-full"
          />
          <CardTitle className="text-xl font-semibold text-gray-900">{stock.companyName}</CardTitle>
        </CardHeader>
        {CardContentComponent}
      </Card>
    </motion.div>
  )

  // If in the watchlist and removing is in progress, show the spinner
  if (pathName === '/watchlist' && status === 'pending') {
    return <SpinnerManager isLoading={true} />
  }

  return pathName === '/watchlist' ? (
    <div className="block">{CardComponent}</div>
  ) : (
    <Link href={`/stock-detail/${stock.symbol}`} className="block">
      {CardComponent}
    </Link>
  )
}

export default StockCard
