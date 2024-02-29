"use client";
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/Input';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // if user is signed then redirect to dashboard
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      };
    })
  })

  // handling email and password signin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password).catch(err => alert(err.message));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-1 text-center">Welcome to Workflow!</h1>
      <h3 className="mb-2 text-center">Access tools to streamline your workflow efficiently.</h3>
      <form className="w-11/12 md:w-full max-w-sm min-w-fit" onSubmit={handleSubmit}>
        <Input value={email} setValue={setEmail} id="email" label="Email" placeholder="Your Email Address" required={true} />
        <Input value={password} setValue={setPassword} id="password" type="password" label="Password" placeholder="Your new password" required={true} />
        <button className="bg-black text-white w-full my-3 py-3 rounded-sm font-bold" type="submit">Sign in</button>
      </form>
      <p>Don&apos;t have an account? <Link href='/signup' className="font-semibold underline">Create here</Link></p>
    </main>
  )
}

export default Login