'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useFetchCategoryStocks } from '../../hooks/use-fetch-category-stocks'
import SpinnerManager from '../../../components/SpinnerManager'
import StockCard from '../../../components/StockCard'
import { Stock } from '../../types/stock-detail'
import ErrorMessage from '../../../components/Error'

export default function Page() {
  const { category } = useParams()

  const { data, isLoading, isError, error } = useFetchCategoryStocks(category, 1, 50)

  if (isLoading) {
    return <SpinnerManager isLoading={isLoading} />
  }

  if (isError || !data) {
    const errorMessage = error?.message.includes('API limit reached') ? 'API limit reached.' : 'Error loading data.'
    return <ErrorMessage message={errorMessage} />
  }

  return (
    <div className="p-4">
      <h1 className="text-center text-4xl uppercase">{category}</h1>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((stock: Stock) => (
          <StockCard key={stock.symbol} stock={stock} mode="compact" />
        ))}
      </div>
    </div>
  )
}
