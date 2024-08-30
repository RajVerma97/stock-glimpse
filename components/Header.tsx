"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  return (
    <header className="py-2 mb-4 rounded-md w-full flex justify-between items-center ">
      <div className="">
        <h1 className="text-3xl font-bold font-sans">Stock Glimpse</h1>
      </div>
      <div>
        <Button
          variant="secondary"
          asChild
          className="hover:border-2 hover:border-blue-200"
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="ml-4 hover:border-2 hover:border-blue-200">
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </header>
  );
}
