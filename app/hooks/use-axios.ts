// import axios, { AxiosInstance } from "axios";
// import { useMemo, useContext, createContext, ReactNode } from "react";
// // import { API_BASE_URL } from "../constants/env-constants";
// import useAuth from "./use-auth";

// // Create a context for Axios instance
// const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

// export const AxiosProvider = ({ children }: { children: ReactNode }) => {
//   const axiosInstance = useAxios();
//   return (
//     <AxiosContext.Provider value={axiosInstance}>
//       {children}
//     </AxiosContext.Provider>
//   );
// };

// export const useAxiosContext = () => {
//   const context = useContext(AxiosContext);
//   if (context === undefined) {
//     throw new Error("useAxiosContext must be used within an AxiosProvider");
//   }
//   return context;
// };

// const useAxios = () => {
//   const { accessToken, signOut } = useAuth();

//   const api = useMemo(() => {
//     const CancelToken = axios.CancelToken;
//     const source = CancelToken.source();

//     const instance = axios.create({
//       baseURL: API_BASE_URL,
//       headers: {
//         Authorization: `Bearer ${accessToken.data}`,
//       },
//       cancelToken: source.token, // Global cancel token
//     });

//     // Request interceptor to logout if token has expired
//     instance.interceptors.response.use(
//       (res) => res,
//       (err) => {
//         if (err?.response?.status === 401) {
//           // Cancel all requests and logout
//           source.cancel();

//           // Use a different method to show error messages if not using antd
//           console.error("Login Expired");
//           // Replace this with your own signOut logic if needed
//           signOut();
//         }

//         return Promise.reject(err);
//       }
//     );

//     return instance;
//   }, [accessToken.data, signOut]);

//   return api;
// };

// export default useAxios;
