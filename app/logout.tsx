"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const { data: session } = useSession();

  

  return <>{session ? <button onClick={logout}>Logout</button> : null}</>;
}
