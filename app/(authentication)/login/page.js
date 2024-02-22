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
    <main>
      <form>
        <input className='input' type="email" placeholder='Email Address' value={email} onChange={(e) => (setEmail(e.target.value))} required={required} /> <br />
        <input className='input' type="password" placeholder='Password' value={password} onChange={(e) => (setPassword(e.target.value))} required={required} /> <br />
        <input type="submit" value="Submit" onClick={handleSubmit} /><br />
      </form>
    </main>
  )
}

export default Login