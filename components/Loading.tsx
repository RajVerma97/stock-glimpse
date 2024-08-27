// components/Loading.tsx
import React from "react";
import SpinnerManager from "@/components/SpinnerManager"; // Adjust the import if necessary

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="w-full p-8 flex justify-center items-center">
      <SpinnerManager isLoading={isLoading} />
    </div>
  );
};

export default Loading;
