"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  
  return (
    <header>
      <h1>Header </h1>

      
    </header>
  
  );
}
