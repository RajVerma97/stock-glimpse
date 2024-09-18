import React, { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from './ui/command'
import { MoonLoader } from 'react-spinners'
import useDebounce from '@/app/hooks/use-debounce'
import { useSearchStocks } from '@/app/hooks/use-search-stocks'
import { useRouter } from 'next/navigation'
import ErrorMessage from './Error'
import Image from 'next/image'

export default function SearchStocks({}) {
  const [searchParams, setSearchParams] = useState<string>('')
  const debouncedSearchParams = useDebounce(searchParams, 400)

  const router = useRouter()

  const {
    data: stockSearchData,
    isLoading: isStockSearchLoading,
    isError: isStockSearchError,
  } = useSearchStocks(debouncedSearchParams)

  if (isStockSearchError) {
    return <ErrorMessage message="Error loading stocks" />
  }

  return (
    <div>
      <Command className=" px-4 py-1 rounded-lg border shadow-md md:min-w-[450px] bg-white text-black focus:border-blue-300">
        <CommandInput
          className="text-2xl p-4 "
          placeholder="search for stocks...."
          value={searchParams}
          onValueChange={(value) => setSearchParams(value)}
        />
        <CommandList className="max-h-60 overflow-y-auto">
          {isStockSearchLoading ? (
            <div className="flex justify-center items-center p-4">
              <MoonLoader
                color="black"
                loading={isStockSearchLoading}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {debouncedSearchParams && stockSearchData?.length === 0 && (
                <CommandEmpty className="text-center p-4 text-gray-500">
                  No results found.
                </CommandEmpty>
              )}
              {debouncedSearchParams && stockSearchData?.length > 0 && (
                <div className="p-4 space-y-2">
                  {stockSearchData.map((stock: any) => (
                    <div
                      className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      key={stock.ticker}
                      onClick={() =>
                        router.push(`/stock-detail/${stock.ticker}`)
                      }
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                        {stock.logo ? (
                          <Image
                            width={100}
                            height={100}
                            src={stock.logo}
                            alt={`${stock.name} logo`}
                            className="w-8 h-8 object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-gray-600 text-xl">
                            {stock.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="ml-3 text-lg font-semibold">
                        {stock.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <CommandSeparator />
        </CommandList>
      </Command>
    </div>
  )
}
