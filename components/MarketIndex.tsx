import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import ErrorMessage from './Error'
import Loading from './Loading'
import { useFetchMarketIndex } from '@/app/hooks/use-fetch-market-index'

export default function MarketIndex() {
  const {
    data: marketIndexInfo,
    isLoading: isMarketIndexInfoLoading,
    isError: isMarketIndexInfoError,
  } = useFetchMarketIndex('SPY')

  return (
    <div className="p-2 bg-white text-black">
      {isMarketIndexInfoLoading ? (
        <Loading isLoading={isMarketIndexInfoLoading} />
      ) : isMarketIndexInfoError ? (
        <ErrorMessage message="Error loading market index" />
      ) : (
        marketIndexInfo && (
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-2xl font-semibold">S&P 500</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              <p className="text-2xl font-semibold">
                ${marketIndexInfo.askPrice}
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
