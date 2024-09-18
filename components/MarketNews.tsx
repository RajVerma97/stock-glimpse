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

export default function MarketNews() {
  const {
    data: marketNews,
    isLoading: isMarketNewsLoading,
    isError: isMarketNewsError,
  } = useFetchMarketNews()

  const filteredMarketNews = marketNews?.filter(
    (item: NewsArticle) =>
      item.source != 'MarketWatch' && item.source != 'Bloomberg',
  )

  const content = useMemo(() => {
    return (
      <Carousel className="relative w-full overflow-hidden p-6">
        <CarouselContent className="flex space-x-10">
          {filteredMarketNews?.map((newsArticle: NewsArticle) => (
            <CarouselItem
              key={newsArticle.id}
              className="flex-shrink-0 w-80 basis-1/3"
            >
              <Link href={newsArticle.url}>
                <div className="relative w-full h-[20rem]">
                  <Image
                    src={newsArticle.image}
                    alt={newsArticle.headline}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="text-gray-300 mt-4 text-lg">
                  {newsArticle.headline}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  }, [marketNews])

  return (
    <div className="max-w-screen-xl ">
      <div className="text-2xl font-semibold text-white mb-4">Market News</div>

      {isMarketNewsLoading ? (
        <Loading isLoading={isMarketNewsLoading} />
      ) : isMarketNewsError ? (
        <ErrorMessage message="Error loading market news" />
      ) : (
        content
      )}
    </div>
  )
}
