"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const openSidebar = () => {
    setOpen(true);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  return (
    <header className="py-2  px-4 mb-4 rounded-md w-full flex justify-between items-center shadow-sm borer-2 border-blue-400">
      <div>
        <Link href="/" className="text-2xl font-bold ">
          Stock Glimpse
        </Link>
      </div>
      <div className="hidden sm:flex">
        <Button variant="secondary" asChild className="hover:border-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Link href="/login">Login</Link>
          </motion.div>
        </Button>
        <Button asChild className="ml-4 hover:border-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Link href="/register">Register</Link>
          </motion.div>
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
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Link
                href="/login"
                className="mb-4 text-2xl"
                onClick={closeSidebar}
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Link href="/register" className="text-xl" onClick={closeSidebar}>
                Register
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
