"use client";
import { auth, workflow } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import Page from '@/app/components/Page';
import Navbar from '../components/Navbar';
import AddPage from '../components/AddPage';
import Loading from '../components/Loading';
const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('login');
      } else {
        const q = query(workflow, where("email", "==", user?.email));
        const response = await getDocs(q);
        response.forEach((doc) => {
          setPages(doc.data().pages);
        })
        setLoading(false)
      }
    })
  }, [router])

  return (<main>
    <Navbar />
    {loading && <Loading />}
    {!loading && <AddPage />}
    {
      !loading && pages.map((page) => {
        return <Page pid={page.pid} key={page.pid} pname={page.pname} timestamp={page.timestamp} />
      })
    }
  </main>
  )
}

export default Dashboard