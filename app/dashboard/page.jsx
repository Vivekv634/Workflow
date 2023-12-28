"use client";
import { auth, workflow } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import Page from '@/app/components/Page';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [pageName, setPageName] = useState('');
  const router = useRouter();

  const handlePageSubmit = (e) => {
    e.preventDefault();
    onAuthStateChanged(auth, async (user) => {
      const q = query(workflow, where("email", "==", user?.email));
      // TODO: create a function to reproduce the pages array in firestore with the new page (with new page name and timestamp)
    })
  }

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
    {
      popup &&
      <div className='absolute h-[90vh] w-full bg-yellow-300'>
          <form onSubmit={handlePageSubmit}>
            <input type="text" placeholder='Page Name' value={pageName} onChange={(e) => { setPageName(e.target.value) }} /><br />
            <input type="checkbox" /> want sample data
            <input type="submit" value="Create Page" />
        </form>
      </div>
    }
    {!loading &&
      <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex md:w-2/4 lg:w-1/3 items-center flex-col hover:bg-slate-300 cursor-pointer' onClick={()=>setPopup(!popup)}>
        <span className='h-16 w-16 rounded-full border-[6px] border-blue-600 bg-transparent'>
          <span className='text-5xl flex justify-center items-center text-blue-600'>+</span>
        </span>
        <span className='mt-1'>New Page</span>
      </div>
    }
    {
      !loading && pages.map((page) => {
        return <Page pid={page.pid} key={page.pid} pname={page.pname} timestamp={page.timestamp} />
      })
    }
  </main>
  )
}

export default Dashboard