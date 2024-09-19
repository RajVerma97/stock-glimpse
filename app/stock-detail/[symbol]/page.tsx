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
    <div className="grid w-full gap-[5rem] p-10">
      <div className="block gap-20 sm:block sm:gap-10 md:flex">
        <FundamentalCard stock={stock} />

        <div className="h-[500px] w-full sm:w-1/2">
          {historicalData && historicalData.length > 0 && (
            <StockPriceChart historicalData={historicalData} timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
          )}
        </div>
      </div>
      <div className="w-full">
        <h1>Share Holding Pattern</h1>
        {stock.shareholdingPattern && <ShareholdingPatternChart data={stock.shareholdingPattern} />}
      </div>

      <RatioCardList stock={stock} />

      <div className="w-full">
        <RatioChart ratios={stock.ratios} />
      </div>

      <div className="w-full">
        <StockNews symbol={symbol} />
      </div>
    </div>
  )
}
