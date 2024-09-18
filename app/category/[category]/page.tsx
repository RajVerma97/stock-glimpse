'use client'
import React, { useState } from 'react'
import { useFetchCategoryStocks } from '@/app/hooks/use-fetch-category-stocks'
import SpinnerManager from '@/components/SpinnerManager'
import { useParams } from 'next/navigation'
import StockTableComponent from '@/components/StockTable'

export default function Page() {
  const { category } = useParams()
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 50,
  })

  const { data, isLoading, isError, error } = useFetchCategoryStocks(
    category,
    pagination.currentPage,
    pagination.limit,
  )

  if (isLoading) {
    return <SpinnerManager isLoading={isLoading} />
  }

  if (isError || !data) {
    const errorMessage = error?.message.includes('API limit reached')
      ? 'API limit reached. Please try again later.'
      : 'Error loading data.'
    return <div className="text-red-500">{errorMessage}</div>
  }

  if (data.stockDetails.length === 0) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl my-4 uppercase">{category}</h1>
        <p className="text-lg text-gray-500">
          No stocks available for this category.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4 uppercase">{category}</h1>
      <StockTableComponent
        data={data.stockDetails}
        pagination={pagination}
        onPageChange={(page) => {
          if (page > 0 && page <= pagination.totalPages) {
            console.log('Page change requested:', page)
            setPagination((prev) => ({ ...prev, currentPage: page }))
          }
        }}
      />
    </div>
  )
}
