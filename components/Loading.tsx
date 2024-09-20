// components/Loading.tsx
import React from 'react'
import SpinnerManager from './SpinnerManager'

interface LoadingProps {
  isLoading: boolean
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="flex w-full items-center justify-center p-8">
      <SpinnerManager isLoading={isLoading} />
    </div>
  )
}

export default Loading
