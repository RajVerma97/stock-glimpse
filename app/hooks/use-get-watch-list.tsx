import { getWatchlist } from '../queries/watchlist'
import useAuthenticatedQuery from './use-authenticated-query'

export function useGetWatchlist() {
  return useAuthenticatedQuery(['get-watchlist'], () => getWatchlist())
}
