// components/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="w-full p-8 flex justify-center items-center">
      <p className="text-red-500 font-semibold">Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;
