import { useFetchMarketNews } from '@/app/hooks/use-fetch-market-news'
import { NewsArticle } from '@/app/types/market-news'
import { useMemo } from 'react'
import ErrorMessage from './Error'
import Loading from './Loading'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import Link from 'next/link'
import Image from 'next/image'
import { useFetchStockNews } from '@/app/hooks/use-fetch-stock-news'

export default function StockNews({ symbol }) {
  const {
    data: stockNews,
    isLoading: isStockNewsLoading,
    isError: isStockNewsError,
  } = useFetchStockNews(symbol)

  console.log(stockNews)
  const content = useMemo(() => {
    return (
      <Carousel className="relative w-full overflow-hidden p-6">
        <CarouselContent className="flex space-x-10">
          {stockNews?.map((stockNews: StockNews) => (
            <CarouselItem
              key={stockNews.uuid}
              className="flex-shrink-0 w-80 basis-1/3"
            >
              <Link href={stockNews.url}>
                <div className="relative w-full h-[20rem]">
                  <Image
                    src={stockNews.image_url}
                    alt={stockNews.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="text-gray-300 mt-4 text-lg">
                  {stockNews.title}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  }, [stockNews])

  return (
    <div className="max-w-screen-xl ">
      <div className="text-2xl font-semibold text-white mb-4">Stock News</div>

      {isStockNewsLoading ? (
        <Loading isLoading={isStockNewsLoading} />
      ) : isStockNewsError ? (
        <ErrorMessage message="Error loading stock news" />
      ) : (
        content
      )}
    </div>
  )
}
