import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ErrorMessage from './Error'
import Skeleton from './Skeleton'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { useFetchMarketNews } from '../app/hooks/use-fetch-market-news'
import { NewsArticle } from '../app/types/market-news'

export default function MarketNews() {
  const { data: marketNews, isLoading: isMarketNewsLoading, isError: isMarketNewsError } = useFetchMarketNews()

  const filteredMarketNews = marketNews?.filter(
    (item: NewsArticle) => item.source !== 'MarketWatch' && item.source !== 'Bloomberg',
  )

  const content = useMemo(() => {
    return (
      <Carousel className="relative w-full overflow-hidden p-6">
        <CarouselContent className="flex space-x-10">
          {filteredMarketNews?.map((newsArticle: NewsArticle) => (
            <CarouselItem key={newsArticle.id} className="w-80 flex-shrink-0 basis-1/3">
              <Link href={newsArticle.url}>
                <div className="relative h-[20rem] w-full">
                  <Image
                    src={newsArticle.image}
                    alt={newsArticle.headline}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="mt-4 text-lg text-gray-300">{newsArticle.headline}</div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  }, [filteredMarketNews])

  return (
    <div className="max-w-screen-xl">
      <div className="mb-4 text-3xl font-semibold text-white">Market News</div>

      {isMarketNewsLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-80 flex-shrink-0 basis-1/3">
              <Skeleton height="20rem" />
              <Skeleton height="24px" width="100%" className="mt-4" />
            </div>
          ))}
        </div>
      ) : isMarketNewsError ? (
        <ErrorMessage message="Error loading market news" />
      ) : (
        content
      )}
    </div>
  )
}
