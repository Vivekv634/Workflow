"use client"
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {

  const handleSignout = () => {
    signOut(auth);
    alert("signed out")
  }
  return (
    <main>
      <Navbar />
      <button type="button" onClick={() => handleSignout()}>Sign out</button>
    </main>
  )
}
