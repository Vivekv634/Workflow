"use client"
import { auth } from "@/config/firebase";
import { signOut as SignOut } from "firebase/auth";
import { signOut } from "next-auth/react";
import Navbar from "./components/Navbar";

export default function Home() {

  const handleSignout = () => {
    signOut(auth);
    alert("signed out")
  }
  return (
    <main>
      <Navbar />
      <button type="button" onClick={() => { signOut(); SignOut(auth)}}>Sign out</button>
    </main>
  )
}
