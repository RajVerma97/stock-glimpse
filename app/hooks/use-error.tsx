import { useCallback } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

// Define a type for the error object
interface ErrorResponse {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getErrorMessage = (error?: ErrorResponse | AxiosError): string => {
  // Default message
  let message: string = "Something went wrong";

  if (error && "message" in error) {
    message = error.message || message; // Fallback to default message if error.message is undefined
  }

  if (error && "isAxiosError" in error) {
    const axiosError = error as AxiosError;

    message = axiosError.message || message; // Fallback to default message if axiosError.message is undefined

    if (axiosError.response?.data?.message) {
      message = axiosError.response.data.message;
    }
  }

  return message;
};

const useError = () => {
  const handleError = useCallback((error: ErrorResponse | AxiosError) => {
    const errorMessage = getErrorMessage(error);

    // Display error using react-toastify
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  return { getErrorMessage, handleError };
};

export default useError;
