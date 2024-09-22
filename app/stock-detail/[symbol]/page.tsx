'use client'

import { useState } from 'react'
import { TimeFrame } from '../../enums/StockPriceChart.enum'
import { useFetchStockDetails } from '../../hooks/use-fetch-stock-details'
import { useFetchHistoricalData } from '../../hooks/use-fetch-historical-data'
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/Error'
import FundamentalCard from '../../../components/FundamentalCard'
import StockNews from '../../../components/StockNews'
import RatioChart from '../../../components/RatioChart'
import RatioCardList from '../../../components/RatioCardList'
import ShareholdingPatternChart from '../../../components/ShareHoldingPatternChart'
import StockPriceChart from '../../../components/StockPriceChart'

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params

  const [timeFrame, setTimeFrame] = useState<string>(TimeFrame.OneMonth)
  const [error] = useState<string | null>(null)

  const { data: stock, isLoading: isStockDetailsLoading, isError: isStockDetailsError } = useFetchStockDetails(symbol)

  const {
    data: historicalData,
    isLoading: isHistoricalDataLoading,
    isError: isHistoricalDataError,
  } = useFetchHistoricalData(symbol)

  if (isStockDetailsLoading || isHistoricalDataLoading) {
    return <Loading isLoading={true} />
  }
  if (isHistoricalDataError) {
    return <ErrorMessage message={'Failed to fetch historical data'} />
  }
  if (isStockDetailsError) {
    return <ErrorMessage message={'Failed to fetch stock details'} />
  }
  if (error) return <ErrorMessage message={error} />

  if (!stock) return <ErrorMessage message="No stock details available" />

  return (
    <div className="grid w-full gap-8 p-4 sm:p-8 md:gap-[5rem] md:p-10">
      <div className="block sm:flex sm:gap-10">
        <div className="mb-8 w-full sm:mb-0 sm:w-1/2">
          <FundamentalCard stock={stock} />
        </div>

        <div className="h-[350px] w-1/2 sm:h-[510px]">
          {historicalData && historicalData.length > 0 && (
            <StockPriceChart historicalData={historicalData} timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
          )}
        </div>
      </div>

      <div className="w-full">
        <h1 className="mb-6 text-center text-2xl font-bold sm:mb-10 sm:text-4xl">Share Holding Pattern</h1>
        {stock.shareholdingPattern && <ShareholdingPatternChart data={stock.shareholdingPattern} />}
      </div>

      <div className="w-full">
        <RatioCardList stock={stock} />
      </div>

      <div className="w-full">
        <h1 className="mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-4xl">Ratio Graph</h1>
        <RatioChart ratios={stock.ratios} />
      </div>

      {/* <div className="w-full">
        <StockNews symbol={symbol} />
      </div> */}
    </div>
  )
}
