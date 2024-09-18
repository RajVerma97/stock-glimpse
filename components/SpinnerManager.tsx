import React, { CSSProperties } from 'react'
import { ClipLoader, MoonLoader } from 'react-spinners'

export default function SpinnerManager({ isLoading }) {
  const override: CSSProperties = {
    display: 'block',
    margin: '0 auto',
    borderColor: '#ffffff',
  }

  return (
    <div>
      {isLoading && (
        <div className="mt-4">
          <MoonLoader
            color="#ffffff"
            loading={isLoading}
            cssOverride={override}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  )
}
