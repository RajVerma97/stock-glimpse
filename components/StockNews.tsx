import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ErrorMessage from './Error'
import Loading from './Loading'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { useFetchStockNews } from '../app/hooks/use-fetch-stock-news'

export default function StockNews({ symbol }: { symbol: string }) {
  const { data: stockNews, isLoading: isStockNewsLoading, isError: isStockNewsError } = useFetchStockNews(symbol)

  const content = useMemo(() => {
    return (
      <Carousel className="relative w-full overflow-hidden p-6">
        <CarouselContent className="flex space-x-10">
          {stockNews?.map((stockNews: StockNews) => (
            <CarouselItem key={stockNews.uuid} className="w-80 flex-shrink-0 basis-1/3">
              <Link href={stockNews.url}>
                <div className="relative h-[20rem] w-full">
                  <Image
                    src={stockNews.image_url}
                    alt={stockNews.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="mt-4 text-lg text-gray-300">{stockNews.title}</div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  }, [stockNews])

  return (
    <div className="max-w-screen-xl">
      <div className="mb-4 text-2xl font-semibold text-white">Stock News</div>

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
