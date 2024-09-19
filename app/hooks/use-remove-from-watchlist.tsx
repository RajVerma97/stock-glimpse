import { useQueryClient } from '@tanstack/react-query'
import { removeFromWatchlist } from '../queries/watchlist'
import useAuthenticatedMutation from './use-authenticated-mutation'
import { notify } from '../../components/ToastManager'

export function useRemoveFromWatchlist(symbol: string) {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation({
    mutationFn: () => removeFromWatchlist(symbol),
    onSuccess: () => {
      notify({ status: 'success', message: 'Stock removed from watchlist successfully.' })
      queryClient.invalidateQueries({ queryKey: ['get-watchlist'] })
    },
    onError: (error) => {
      notify({ status: 'error', message: 'Error removing Stock from watchlist.' + error })
    },
  })
}
