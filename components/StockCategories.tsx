'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from './ui/card'

export default function StockCategories() {
  const categories = [
    {
      title: 'TECHNOLOGY',
      image: '/technology.jpg',
      stocks: [],
    },
    {
      title: 'FINANCE',
      image: '/finance.jpg',
      stocks: [],
    },
    {
      title: 'HEALTHCARE',
      image: '/healthcare.jpg',
      stocks: [],
    },
    {
      title: 'ENERGY',
      image: '/energy.jpg',
      stocks: [],
    },
    {
      title: 'CONSUMER_DISCRETIONARY',
      image: '/consumer-discretionary.jpg',
      stocks: [],
    },
    {
      title: 'CONSUMER_STAPLES',
      image: '/consumer-staples.jpg',
      stocks: [],
    },
    {
      title: 'UTILITIES',
      image: '/utilities.jpg',
      stocks: [],
    },
    {
      title: 'MATERIALS',
      image: '/materials.jpg',
      stocks: [],
    },
    {
      title: 'INDUSTRIALS',
      image: '/industrials.jpg',
      stocks: [],
    },
    {
      title: 'REAL_ESTATE',
      image: '/real-estate.jpg',
      stocks: [],
    },
    {
      title: 'TELECOMMUNICATIONS',
      image: '/telecommunications.jpg',
      stocks: [],
    },
    {
      title: 'AGRICULTURE',
      image: '/agriculture.jpg',
      stocks: [],
    },
  ]

  return (
    <div className="overflow-hidden">
      <h1 className="mb-8 text-3xl font-bold text-white">Stock Categories</h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => {
          return (
            <Link href={`/category/${category.title}`} key={index}>
              <Card className="transform overflow-hidden rounded-lg border border-gray-200 p-4 transition-transform hover:scale-105">
                <div className="relative mb-4 h-40 w-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full rounded-md object-cover"
                    layout="fill"
                  />
                </div>
                <h1 className="text-lg font-semibold text-gray-400 sm:text-xl text-center">{category.title}</h1>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
