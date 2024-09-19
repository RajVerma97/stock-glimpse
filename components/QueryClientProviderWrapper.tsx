'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import queryClient from '@/lib/queryClient'

const QueryClientProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryClientProviderWrapper
