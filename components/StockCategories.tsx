"use client";
import React from "react";
import { Card } from "./ui/card";
import Link from "next/link";

export default function StockCategories() {
  const categories = [
    {
      title: "Small Cap",
      slug: "small-cap",
      stocks: [],
    },
    {
      title: "Mid Cap",
      slug: "mid-cap",
      stocks: [],
    },
    {
      title: "Large Cap",
      slug: "large-cap",
      stocks: [],
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Stock Category</h1>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category, index) => {
          return (
            <Link href={`/category/${category.slug}`} key={index}>
              <Card className="p-8 text-center">
                <h1 className="text-xl font-semibold text-white">
                  {category.title}
                </h1>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
