"use client";
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const required = true;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    })
  })
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = await signInWithEmailAndPassword(auth, email, password);
  }
  return (
    <main>
      <form>
        <input className='input' type="email" placeholder='Email Address' value={email} onChange={(e) => (setEmail(e.target.value))} required={required} />
        <input className='input' type="password" placeholder='Password' value={password} onChange={(e) => (setPassword(e.target.value))} required={required} />
        <input type="submit" value="Submit" onClick={handleSubmit} />
      </form>
    </main>
  )
}

export default Login