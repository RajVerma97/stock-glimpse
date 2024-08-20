"use client";
import Link from "next/link";
import React from "react";
import Logout from "./logout";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };
  return (
    <>
      <h1>SplashPage</h1>

      <div>
        <Link href="/login">Login</Link>
      </div>

      <div>
        <Link href="/register">Register</Link>
      </div>

      {session ? <button onClick={logout}>Logout</button> : null}
    </>
  );
}
