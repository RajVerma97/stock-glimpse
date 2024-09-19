import React, { CSSProperties } from 'react'
import { MoonLoader } from 'react-spinners'

export default function SpinnerManager({ isLoading }: { isLoading: boolean }) {
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
