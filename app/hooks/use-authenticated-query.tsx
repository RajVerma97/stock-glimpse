import {
  QueryFunctionContext,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { useAxiosContext } from "./axios-context";

export type QueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey
> = (
  context: QueryFunctionContext<TQueryKey>,
  axios: AxiosInstance
) => T | Promise<T>;

export default function useAuthenticatedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const axios = useAxiosContext();

  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    queryKey,
    (context) => queryFn(context, axios),
    options // Pass options as the third argument
  );
}
