"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import MenuSVG from "@/public/menu.svg"
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, workflow } from '@/config/firebase';
import { getDocs, query, where } from 'firebase/firestore';

const Navbar = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [photoURL, setPhotoURL] = useState('');
    const [name, setName] = useState('');
    const [navMenu, setNavMenu] = useState(false);

    // getting and setting user's name and its photoURL
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuth(true);
                const q = query(workflow, where("email", "==", user.email));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    setPhotoURL(doc.data().photoURL);
                    setName(doc.data().name);
                })
            }
        })
    })
    return (
        <header className='w-screen shadow-md'>
            <section className='flex justify-between items-center px-4 h-[6rem] md:w-11/12 md:m-auto'>
                <h1 className='font-extrabold text-2xl cursor-pointer font-sans'><Link href='/'>Workflow</Link></h1>
                <div className={`hidden md:block`}>
                    <ul className={`flex ${navMenu && "absolute"} top-4`}>
                        <li><Link href='#home' className='mr-4 hover:border-b-2 hover:border-black transition-all font-medium'>Home</Link></li>
                        <li><Link href='#features' className='mr-4 hover:border-b-2 hover:border-black transition-all font-medium'>Features</Link></li>
                        {!isAuth &&
                            <>
                                <li><Link href='/login' className='px-5 py-3 bg-black text-white font-medium hover:bg-slate-950'>Sign in</Link></li>
                                <li><Link href='/signup' className='px-5 py-3 bg-black text-white font-medium hover:bg-slate-950'>Sign up</Link></li>
                            </>
                        }
                        {isAuth &&
                            <>
                                <li><Link href='/dashboard' className='px-5 py-3 bg-black text-white font-medium hover:bg-slate-950'>Dashboard</Link></li>
                                <li><button type='button' onClick={() => { signOut(auth), window.location.reload() }} className='px-5 py-[.63rem] -mt-3 bg-black text-white font-medium hover:bg-slate-950'>Logout</button></li>
                            </>
                        }
                    </ul>
                </div>
                <div className="md:hidden"><Image onClick={() => setNavMenu(!navMenu)} src={MenuSVG} alt='menu icon' width={40} height={40} /></div>
                <div className={`md:hidden absolute ${navMenu ? "block" : "hidden"} top-[6rem] left-0 bg-white w-full h-screen`}>
                    <ul className='flex flex-col shadow-inner items-center h-full gap-1 pt-16 w-full'>
                        <li className='w-full flex justify-center mb-7'><Link onClick={() => setNavMenu(!navMenu)} href='#home' className='mr-4 hover:border-b-2 hover:border-black transition-all text-2xl font-medium'>Home</Link></li>
                        <li className='w-full flex justify-center mb-7'><Link onClick={() => setNavMenu(!navMenu)} href='#features' className='mr-4 hover:border-b-2 hover:border-black transition-all text-2xl font-medium'>Features</Link></li>
                        {!isAuth &&
                            <>
                                <li className='w-full flex justify-center mb-7'><Link href='/login' className='px-5 py-3 bg-black text-white text-2xl font-medium hover:bg-slate-950 w-3/5 text-center'>Sign in</Link></li>
                                <li className='w-full flex justify-center mb-7'><Link href='/signup' className='px-5 py-3 bg-black text-white text-2xl font-medium hover:bg-slate-950 w-3/5 text-center'>Sign up</Link></li>
                            </>
                        }
                        {isAuth &&
                            <>
                                <li className='w-full flex justify-center mb-7'><Link href='/dashboard' className='px-5 py-3 bg-black text-white text-2xl font-medium hover:bg-slate-950 w-3/5 text-center'>Dashboard</Link></li>
                                <li className='w-full flex justify-center mb-7'><button type='button' onClick={() => signOut(auth)} className='px-5 py-3 bg-black text-white text-2xl font-medium hover:bg-slate-950 w-3/5 text-center'>Logout</button></li>
                            </>
                        }
                    </ul>
                </div>
            </section>
        </header>
    )
}

export default Navbar