import './globals.css'
import NextAuthProvider from './providers'
import { AxiosProvider } from './hooks/axios-context'
import QueryClientProviderWrapper from '../components/QueryClientProviderWrapper'
import Header from '../components/Header'
import BackButton from '../components/BackButton'

export const metadata = {
  title: 'Stock Glimpse',
  description: 'US Stocks Glimpse',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProviderWrapper>
          <NextAuthProvider>
            <AxiosProvider>
              <Header />
              <BackButton />
              {children}
              {/* <Footer /> */}
            </AxiosProvider>
          </NextAuthProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}
