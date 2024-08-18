"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Logout from "../logout";
import Image from "next/image";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // Wait for session to load
  }

  if (!session) {
    return <p>No session found</p>; // Handle missing session
  }

  return (
    <div>
      <h1>Home page </h1>
      <div>Email --- {session?.user?.email}</div>
      <div>Username --- {session?.user?.name}</div>
      {session?.user?.image && (
        <Image src={session.user.image} alt="profile" width={50} height={50} />
      )}
      <Logout />
    </div>
  );
}
