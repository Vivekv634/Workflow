"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import MenuSVG from "@/public/menu.svg"
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';

const Navbar = () => {
    const [navbar, setNavbar] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const handleNavbar = () => {
        setNavbar(!navbar)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true);
            }
        })
    })
    return (
        <header className=''>
            <nav className='relative w-full bg-blue-800 h-[10vh] flex m-auto justify-between text-center items-center text-white'>
                <div className="text-xl pl-5"><Link href='/'>Workflow</Link></div>
                <ul className={`${navbar ? 'block' : 'hidden'} z-50 absolute top-[10vh] bg-yellow-500 w-full  md:flex md:static md:w-fit md:bg-transparent`}>
                    {!isAuth && <li className='flex flex-col p-6'>
                        <Link onClick={() => { handleNavbar() }} href='/signup'>Sign Up</Link>
                    </li>}
                    {!isAuth && <li className='flex flex-col p-6'>
                        <Link onClick={() => { handleNavbar() }} href='/login'>Login</Link>
                    </li>}
                    {isAuth && <li className='flex flex-col p-6'>
                        <Link onClick={() => { handleNavbar() }} href='/dashboard'>Dashboard</Link>
                    </li>}
                </ul>
                <div className="md:hidden">
                    <Image onClick={() => handleNavbar()} className='cursor-pointer ' alt='menu' height={50} width={50} src={MenuSVG} />
                </div>
            </nav>
        </header>
    )
}

export default Navbar