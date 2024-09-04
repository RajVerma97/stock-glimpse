"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Logout from "@/app/logout";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const openSidebar = () => {
    setOpen(true);
  };

  const closeSidebar = () => {
    setOpen(false);
  };
  const logout = async () => {
    await signOut();
  };

  return (
    <header className="py-2  px-4 mb-4 rounded-md w-full flex justify-between items-center shadow-sm borer-2 border-blue-400">
      <div>
        <Link href="/" className="text-2xl font-bold ">
          Stock Glimps..
        </Link>
      </div>
      <div className="hidden sm:flex">
        <Button variant="secondary" asChild>
          {session ? (
            <Button onClick={logout}>Logout</Button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>

        <Button asChild>
          <Link href="/watchlist">Watchlist</Link>
        </Button>
      </div>
      <div className="sm:hidden">
        <Button onClick={openSidebar}>
          <Menu size={30} />
        </Button>
      </div>

      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 w-3/4 h-full bg-blue-500 shadow-lg z-50 sm:hidden"
        >
          <div className="p-4">
            <Button variant="ghost" onClick={closeSidebar}>
              <ArrowLeft size={30} />
            </Button>
          </div>
          <div className="mt-8 flex flex-col items-start px-4 ">
            <Link href="/login" onClick={closeSidebar}>
              Login
            </Link>

            <Link href="/register" className="text-xl" onClick={closeSidebar}>
              Register
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
