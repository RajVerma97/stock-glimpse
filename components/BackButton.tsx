"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathName = usePathname();

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {pathName !== "/" && (
        <Button onClick={goBack}>
          <ArrowLeft
            size={35}
            className="hover:scale-125 hover:text-gray-300 hover:text-lg"
          />
        </Button>
      )}
    </>
  );
}
