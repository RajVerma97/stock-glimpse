import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from './ui/card'

const bounceVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05, // Scale up slightly on hover
    transition: {
      type: 'spring',
      stiffness: 300, // Controls the springiness
      damping: 10, // Controls the "bounciness"
    },
  },
}

interface RatioCardProps {
  title: string
  value: number
  icon: React.ElementType
}

export default function RatioCard({ title, value, icon: Icon }: RatioCardProps) {
  if (!value) return null
  return (
    <motion.div initial="initial" whileHover="hover" variants={bounceVariants} className="">
      <Card className="overflow-hidden rounded-lg bg-gradient-to-r from-gray-100 to-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          {Icon && <Icon className="mr-2 h-6 w-6 text-gray-600" />}
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-pink-600">
            {value?.toFixed(2)} {title === 'ROE' || title === 'ROI' ? '%' : ''}
          </h1>
        </CardContent>
      </Card>
    </motion.div>
  )
}
