"use client";
import { auth, db, workflow } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getDocs, query, where, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import Page from '@/app/components/Page';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { uid } from 'uid';

const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [pageName, setPageName] = useState('');
  const [id, setId] = useState('');
  const [hideClose, setHideClose] = useState(true);
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      getDocs(workflow).then((response) => {
        response.docs.map(item => {
          if (item.data().email == user.email) {
            setId(item.id);
          }
        })
      })
    }
  })
  
  const handlePageSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const docRef = doc(db, "workflow", id);
    await updateDoc(docRef, {
      pages: arrayUnion(
        {
          pid: uid(20),
          pname: pageName,
          timestamp: Date(),
          update_timestamp: Date(),
          nodes: [
            {
              id: '1',
              data: { label: 'Hello' },
              position: { x: 0, y: 0 },
              type: 'input'
            },
            {
              id: '2',
              data: { label: 'World' },
              position: { x: 100, y: 100 },
              type: 'output'
            }
          ],
          edges: [
            {
              id: "1-2",
              type: "",
              label: "",
              source: "1",
              target: "2"
            }
          ]
        }
      )
    }).then(() => {
      setPopup(!popup)
      window.location.reload();
    }).catch(err =>
      console.error(err.message))
    setLoading(false);
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

  return (
    <>
      <Navbar />
      <main className=''>
        {loading && <Loading />}
        {
          popup &&
          <div className='absolute bg-slate-300 w-full h-2/5 md:h-2/6 -mt-3 flex justify-center'>
            <section className='w-10/12 md:w-7/12 lg:w-1/2 flex flex-col justify-evenly'>
              <h2 className='text-[1.5rem] md:text-3xl mx-auto my-2 text-blue-900 font-bold'>Create a New Page</h2>
              <form className='my-2'>
                <input type="text" autoFocus={true} placeholder='Page Name' value={pageName} onChange={(e) => { setPageName(e.target.value) }} className='input w-full outline' /><br />
                <div>
                  <input className='block p-2 bg-blue-600 w-full text-white rounded-md my-3 hover:bg-blue-700 cursor-pointer' type="submit" value="Create Page" onClick={handlePageSubmit} />
                  <button className='p-2 my-2 border-2 border-blue-600 rounded-md w-full text-blue-600' type="button" onClick={() => setPopup(!popup)}>Cancel</button>
                </div>
              </form>
            </section>
          </div>
        }
        {!loading &&
          <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex md:w-2/4 lg:w-1/3 items-center flex-col hover:bg-slate-300 cursor-pointer' onClick={() => setPopup(!popup)}>
            <span className='h-16 w-16 rounded-full border-[6px] border-blue-600 bg-transparent'>
              <span className='text-5xl flex justify-center items-center text-blue-600'>+</span>
            </span>
            <span className='mt-1'>New Page</span>
          </div>
        }
        {
          !loading && pages.map((page) => {
            return <Page pid={page.pid} key={page.pid} pname={page.pname} timestamp={page.timestamp} hideClose={hideClose} />
          })
        }
      </main>
    </>
  )
}

export default Dashboard