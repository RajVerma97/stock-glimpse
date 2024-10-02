'use client'

import { Suspense, useState } from 'react'
import { TimeFrame } from '../../enums/StockPriceChart.enum'
import { useFetchStockDetails } from '../../hooks/use-fetch-stock-details'
import { useFetchHistoricalData } from '../../hooks/use-fetch-historical-data'
import ErrorMessage from '../../../components/Error'
import FundamentalCard from '../../../components/FundamentalCard'
import RatioChart from '../../../components/RatioChart'
import RatioCardList from '../../../components/RatioCardList'
import ShareholdingPatternChart from '../../../components/ShareHoldingPatternChart'
import StockPriceChart from '../../../components/StockPriceChart'
import Skeleton from '../../../components/Skeleton'

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params

  const [timeFrame, setTimeFrame] = useState<string>(TimeFrame.OneMonth)

  const { data: stock, isLoading: isStockLoading, isError: isStockError } = useFetchStockDetails(symbol)
  const {
    data: historicalData,
    isLoading: isHistoricalLoading,
    isError: isHistoricalError,
  } = useFetchHistoricalData(symbol)

  return (
    <div className="grid w-full gap-8 p-4 sm:p-8 md:gap-[5rem] md:p-10">
      <Suspense fallback={<Skeleton width="100%" height="20rem" className="rounded-lg" />}>
        <div className="block sm:flex sm:gap-10">
          <div className="mb-8 w-full sm:mb-0 sm:w-1/2">
            {isStockLoading ? (
              <Skeleton width="100%" height="20rem" className="rounded-lg" />
            ) : isStockError ? (
              <ErrorMessage message="No stock details available." />
            ) : (
              <FundamentalCard stock={stock} isLoading={false} />
            )}
          </div>

          <div className="h-[350px] w-1/2 sm:h-[510px]">
            {isHistoricalLoading ? (
              <Skeleton width="100%" height="20rem" className="rounded-lg" />
            ) : isHistoricalError ? (
              <ErrorMessage message="No historical data available." />
            ) : historicalData && historicalData.length > 0 ? (
              <StockPriceChart historicalData={historicalData} timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
            ) : (
              <ErrorMessage message="No historical data available." />
            )}
          </div>
        </div>

        <div className="w-full">
          <h1 className="mb-6 text-center text-2xl font-bold sm:mb-10 sm:text-4xl">Share Holding Pattern</h1>
          {isStockLoading ? (
            <Skeleton width="100%" height="20rem" className="rounded-lg" />
          ) : isStockError ? (
            <ErrorMessage message="No shareholding pattern data available." />
          ) : stock && stock.shareholdingPattern ? (
            <ShareholdingPatternChart data={stock.shareholdingPattern} />
          ) : (
            <ErrorMessage message="No shareholding pattern data available." />
          )}
        </div>

        <div className="w-full">
          <h1 className="mb-6 text-center text-2xl font-bold sm:mb-10 sm:text-4xl">Ratios</h1>
          {isStockLoading ? (
            <Skeleton width="100%" height="20rem" className="rounded-lg" />
          ) : isStockError ? (
            <ErrorMessage message="No ratios available." />
          ) : (
            <RatioCardList stock={stock} />
          )}
        </div>

        <div className="w-full">
          <h1 className="mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-4xl">Ratio Graph</h1>
          {isStockLoading ? (
            <Skeleton width="100%" height="20rem" className="rounded-lg" />
          ) : isStockError ? (
            <ErrorMessage message="No ratio data available." />
          ) : (
            <RatioChart ratios={stock ? stock.ratios : []} />
          )}
        </div>
      </Suspense>
    </div>
  )
}
