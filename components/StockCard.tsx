import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface StockCardProps {
  stock: any;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  return (
    <Link href={`/stock-detail/${stock.symbol}`} className="block">
      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
          color: "",
          backgroundColor: "blue",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-lg"
      >
        <Card className="p-4 border rounded-lg cursor-pointer bg-white shadow-md">
          <CardHeader className="flex items-center border-b pb-2 mb-2">
            <Image
              width={100}
              height={100}
              src={stock?.logo}
              alt={`${stock.name} logo`}
              className="w-16 h-16 mr-4 rounded-full"
            />
            <CardTitle className="text-xl font-semibold text-gray-900">
              {stock.companyName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-800">
              ${stock.currentPrice}
            </p>
            <p
              className={`text-lg font-semibold ${
                stock.change > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stock.change}%
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default StockCard;
