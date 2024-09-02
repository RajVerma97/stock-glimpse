
import { useMutation } from "@tanstack/react-query";

interface UseAuthenticatedMutationOptions<TData> {
  mutationFn: (data: TData) => Promise<any>;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const useAuthenticatedMutation = <TData,>(
  options: UseAuthenticatedMutationOptions<TData>
) => {
  const { mutationFn, onSuccess, onError } = options;

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

export default useAuthenticatedMutation;
