import { addToWatchlist } from '../queries/watchlist'
import useAuthenticatedMutation from './use-authenticated-mutation'
import { Stock } from '../types/stock-detail'
import { notify } from '../../components/ToastManager'

export const useAddToWatchListMutation = () => {
  return useAuthenticatedMutation({
    mutationFn: (stock: Stock) => addToWatchlist(stock),

    onSuccess: (data) => {
      notify({
        message: data?.message || 'Stock Added To Watchlist Successfully',
        status: 'success',
      })
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message
      notify({
        message: errorMessage || 'Something went wrong',
        status: 'error',
      })
    },
  })
}
