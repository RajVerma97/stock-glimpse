import React from 'react'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '0.5rem',
  className = '',
}) => {
  return <div className={`animate-pulse bg-gray-200 ${className}`} style={{ width, height, borderRadius }} />
}

export default Skeleton
