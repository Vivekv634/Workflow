"use client"
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <button type="button" onClick={() => { signOut(auth) }}>Sign out</button>
    </main>
  )
}
