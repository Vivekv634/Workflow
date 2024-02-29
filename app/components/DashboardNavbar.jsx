"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AddSVG from "@/public/add.svg"
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, workflow } from '@/config/firebase';
import { getDocs, query, where, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { uid } from 'uid';
import Input from './Input';
import Loading from './Loading';

const Navbar = () => {
    const [createPagePopup, setCreatePagePopup] = useState(true);
    const [pageName, setPageName] = useState('');
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);

    // getting and setting signedin user's id on page load
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(workflow, where("email", "==", user?.email));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    setId(doc._key.path.segments[doc._key.path.segments.length - 1]);
                })
            }
        })
    }, []);

    // craeting new page handling function
    const handleFormSubmit = async () => {
        setLoading(true);
        const docRef = doc(db, "workflow", id);
        await updateDoc(docRef, {
            pages: arrayUnion(
                {
                    pid: uid(20),
                    pname: pageName,
                    timestamp: Date(),
                    update_timestamp: Date(),
                    nodes: [],
                    edges: []
                }
            )
        }).then(() => {
            alert("Page created")
            setCreatePagePopup(false);
            window.location.reload();
        }).catch(err =>
            console.error(err.message));
    }

    return (
        <>
            {loading && <Loading />}
            {!loading &&
                <>
                    <header className='w-screen shadow-md'>
                        <section className='flex justify-between items-center px-4 h-[6rem] w-11/12 m-auto'>
                            <h1 className='font-extrabold text-2xl cursor-pointer font-sans'><Link href='/'>Workflow</Link></h1>
                            <button onClick={() => setCreatePagePopup(!createPagePopup)} type="button" className='flex font-semibold bg-slate-200 py-2 px-4 rounded-md hover:bg-slate-300 transition-all'>
                                <Image className='border-2 border-black rounded-full' src={AddSVG} alt='Create a Page' />
                                <span className='pl-1'>Create</span>
                            </button>
                        </section>
                    </header>
                    <div className={`${createPagePopup && "hidden"} absolute h-[88vh] w-full text-black flex justify-center items-center `}>
                        <section className="bg-slate-100 rounded-2xl p-2">
                            <h2 className="text-center text-3xl font-bold font-sans py-3">Create Page</h2>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <Input type="text" id="page" placeholder="Page Name" value={pageName} setValue={setPageName} required={true} />
                                <div className="flex justify-around">
                                    <input className='w-[45%] border-2 border-black rounded-lg py-2 my-1 text-xl font-sans text-white bg-black hover:bg-slate-900' onClick={handleFormSubmit} type="submit" value="Create" />
                                    <input className='w-[45%] border-2 border-black rounded-lg py-2 my-1 text-xl font-sans hover:text-white hover:bg-black transition-all' type="button" value="Cancel" onClick={() => setCreatePagePopup(!createPagePopup)} />
                                </div>
                            </form>
                        </section>
                    </div>
                </>
            }
        </>
    )
}

export default Navbar