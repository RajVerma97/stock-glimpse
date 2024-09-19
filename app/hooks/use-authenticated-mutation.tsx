import { useMutation, UseMutationResult } from '@tanstack/react-query'

interface UseAuthenticatedMutationOptions<TData, TSuccess, TError> {
  mutationFn: (data: TData) => Promise<TSuccess>
  onSuccess?: (data: TSuccess) => void
  onError?: (error: TError) => void
}

const useAuthenticatedMutation = <TData, TSuccess, TError = any>(
  options: UseAuthenticatedMutationOptions<TData, TSuccess, TError>,
): UseMutationResult<TSuccess, TError, TData> => {
  const { mutationFn, onSuccess, onError } = options

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  })
}

export default useAuthenticatedMutation
