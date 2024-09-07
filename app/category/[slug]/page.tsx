"use client";
import { useFetchCategoryStocks } from "@/app/hooks/use-fetch-category-stocks";
import SpinnerManager from "@/components/SpinnerManager";
import { useParams } from "next/navigation";
import React from "react";

export default function page() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useFetchCategoryStocks(slug);

  if (!data) {
    return <SpinnerManager isLoading={isLoading} />;

    return <div>Category page {slug}</div>;
  }
}
