import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div>
        <h2 className='text-red-500'>Not Found</h2>
        <p>Sorry, page you are looking for does not exist.</p>
        <Link href="/">Return Home</Link>
    </div>
  )
}
