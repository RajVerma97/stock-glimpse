import Link from "next/link";
import React from "react";
import Logout from "./logout";

export default function SplashPage() {
  return (
    <>
      <h1>SplashPage</h1>

      <div>
        <Link href="/login">Login</Link>
      </div>

      <div>
        <Link href="/register">Register</Link>
      </div>

      <Logout />
    </>
  );
}
