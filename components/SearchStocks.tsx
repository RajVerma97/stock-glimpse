import React, { useState } from 'react'
import { MoonLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Command, CommandEmpty, CommandInput, CommandList, CommandSeparator } from './ui/command'
import ErrorMessage from './Error'
import useDebounce from '../app/hooks/use-debounce'
import { useSearchStocks } from '../app/hooks/use-search-stocks'

export default function SearchStocks() {
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
      <Command className="rounded-lg border bg-white px-4 py-1 text-black shadow-md focus:border-blue-300 md:min-w-[450px]">
        <CommandInput
          className="p-4 text-2xl"
          placeholder="search for stocks...."
          value={searchParams}
          onValueChange={(value) => setSearchParams(value)}
        />
        <CommandList className="max-h-60 overflow-y-auto">
          {isStockSearchLoading ? (
            <div className="flex items-center justify-center p-4">
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
                <CommandEmpty className="p-4 text-center text-gray-500">No results found.</CommandEmpty>
              )}
              {debouncedSearchParams && stockSearchData?.length > 0 && (
                <div className="space-y-2 p-4">
                  {stockSearchData.map((stock: any) => (
                    <div
                      className="flex cursor-pointer items-center rounded-lg p-3 transition-colors duration-200 hover:bg-gray-100"
                      key={stock.ticker}
                      onClick={() => router.push(`/stock-detail/${stock.ticker}`)}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                        {stock.logo ? (
                          <Image
                            width={100}
                            height={100}
                            src={stock.logo}
                            alt={`${stock.name} logo`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl text-gray-600">{stock.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="ml-3 text-lg font-semibold">{stock.name}</span>
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
