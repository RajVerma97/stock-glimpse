'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from './ui/button'

export default function BackButton() {
  const router = useRouter()
  const pathName = usePathname()

  const goBack = () => {
    router.back()
  }

  return (
    <>
      {pathName !== '/' && (
        <Button onClick={goBack}>
          <motion.div
            whileHover={{ scale: 1.25, color: '#D1D5DB' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <ArrowLeft size={35} className="text-pink-500 bg-transparent" />
          </motion.div>
        </Button>
      )}
    </>
  )
}
