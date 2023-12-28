"use client"

import { auth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('login');
      }
    })
  })
  return (
      <div>Dashboard</div>
  )
}

export default Dashboard