"use client";
import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { auth, db } from '@/config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const workflow = collection(db, "workflow");
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
      if (user) router.push("/dashboard");
    })
  })

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6 || cpassword.length < 6) {
      alert("Password must be of 6 letters");
      return;
    }
    if (password !== cpassword) {
      alert("Password doesn't match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        name: name,
        email: email,
        photoURL: photoURL,
        pages: [
          {
            pid: uid(20),
            pname: "Project 1",
            timestamp: Date(),
            update_timestamp: Date(),
            nodes: [],
            edges: []
          }
        ]
      }
      await addDoc(workflow, userData).then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/dashboard');
          }
        })
      }).catch(err => console.log(err))
    } catch (err) {
      alert(err);
    }
  }

  return (
    <main>
        <form>
          <input className='input' type="text" placeholder='Name' value={name} onChange={(e) => (setName(e.target.value))} required={required} /> <br />
          <input className='input' type="email" placeholder='Email Address' value={email} onChange={(e) => (setEmail(e.target.value))} required={required} /> <br />
          <input className='input' type="password" placeholder='New Password' value={password} onChange={(e) => (setPassword(e.target.value))} required={required} /> <br />
          <input className='input' type="password" placeholder='Confirm New Password' value={cpassword} onChange={(e) => (setCPassword(e.target.value))} required={required} /> <br />
          <input type="submit" value="Submit" onClick={handleFormSubmit} /><br /> <br />
        </form>
      <button type="button" className='p-2 m-1 bg-blue-600 text-white rounded-md' onClick={() => signIn('google')}>Sigup with google</button> <br />
      <button type="button" className='p-2 m-1 bg-blue-600 text-white rounded-md' onClick={() => signIn('github')}>Sigup with github</button>
    </main>
  )
}

export default Signup