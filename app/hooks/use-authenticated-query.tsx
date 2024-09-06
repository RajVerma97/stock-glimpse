import {
  QueryFunctionContext,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { useAxiosContext } from "./axios-context";

// Define QueryFunction to receive AxiosInstance
export type QueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey
> = (
  context: QueryFunctionContext<TQueryKey>,
  axios: AxiosInstance
) => T | Promise<T>;

// Extend UseQueryOptions to include onSuccess and onError callbacks
export type UseAuthenticatedQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
> & {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
};

export default function useAuthenticatedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseAuthenticatedQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const axios = useAxiosContext(); // Get the Axios instance from context

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: (context) => queryFn(context, axios),
    ...options, // Spread options here to include onSuccess and onError
  });
}
