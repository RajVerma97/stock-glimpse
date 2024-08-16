"use client"; // This indicates it's a client-side component
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>; // Wait for session to load
  }
  console.log(session, status);

  if (status === "unauthenticated") {
    // Redirect to login page

    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>Home page {session?.user?.email}</h1>

      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
