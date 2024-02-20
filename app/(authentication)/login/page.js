"use client";
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const required = true;
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [router, status])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push('/dashboard');
    })
  })
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = await signInWithEmailAndPassword(auth, email, password);
  }
  return (
    <main>
      <form>
        <input className='input' type="email" placeholder='Email Address' value={email} onChange={(e) => (setEmail(e.target.value))} required={required} /> <br />
        <input className='input' type="password" placeholder='Password' value={password} onChange={(e) => (setPassword(e.target.value))} required={required} /> <br />
        <input type="submit" value="Submit" onClick={handleSubmit} />
      </form>
    </main>
  )
}

export default Login