"use client";
import Link from "next/link";
import React from "react";
import Logout from "./logout";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const register = () => {
    router.push("/register");
  };

  const login = () => {
    router.push("/login");
  };
  return (
    <>
      <h1>SplashPage</h1>

      <Button variant={"link"} asChild>
        <Link href="/login">Login</Link>
      </Button>

      <Button asChild variant={"link"}>
        <Link href={"/register"} onClick={register}>
          Register
        </Link>
      </Button>

      {session ? (
        <Button onClick={logout} variant={"outline"}>
          Logout
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}
