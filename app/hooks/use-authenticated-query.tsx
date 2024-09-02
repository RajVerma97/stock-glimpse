import {
  QueryFunctionContext,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosInstance } from "axios";
// import {
//   QueryFunctionContext,
//   QueryKey,
//   useQuery,
//   UseQueryOptions,
//   UseQueryResult,
// } from "react-query";
// import { useAxiosContext } from "./use-axios";
import useError from "./use-error";

export declare type QueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey
> = (context: QueryFunctionContext<TQueryKey>) => T | Promise<T>;

export default function useAuthenticatedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: (
    context: QueryFunctionContext<TQueryKey>,
    axios: AxiosInstance
  ) => TQueryFnData | Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const axios = useAxiosContext();
  const { handleError } = useError();
  return useQuery(
    queryKey,
    (context) => {
      return queryFn(context, axios);
    },
    {
      ...options,
      onError: (err) => {
        if (options?.onError) options.onError(err);
        handleError(err);
      },
    }
  );
}
function useAxiosContext() {
  throw new Error("Function not implemented.");
}

function useError(): { handleError: any } {
  throw new Error("Function not implemented.");
}
