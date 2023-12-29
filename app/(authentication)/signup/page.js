"use client";
import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { auth, db } from '@/config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const workflow = collection(db, "workflow");
  const router = useRouter();
  const required = true;
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      setName(data?.user?.name);
      setEmail(data?.user?.email);
      setPhotoURL(data?.user?.image);
      setIsAuth(true);
    }
  }, [status, data])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
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
        ]
      }
      await addDoc(workflow, userData).then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/');
          }
        })
      }).catch(err => console.log(err))
    } catch (err) {
      alert(err);
    }
  }

  return (
    <main>
      {isAuth &&
        <form>
          <Image src={photoURL} height={40} width={40} alt='profile photo' />
          <input className='input' type="text" placeholder='Name' value={name} onChange={(e) => (setName(e.target.value))} required={required} />
          <input className='input' type="email" placeholder='Email Address' value={email} onChange={(e) => (setEmail(e.target.value))} required={required} />
          <input className='input' type="password" placeholder='New Password' value={password} onChange={(e) => (setPassword(e.target.value))} required={required} />
          <input className='input' type="password" placeholder='Confirm New Password' value={cpassword} onChange={(e) => (setCPassword(e.target.value))} required={required} />
          <input type="submit" value="Submit" onClick={handleFormSubmit} />
        </form>}
      {!isAuth && <button type="button" onClick={() => signIn('google')}>Sigup with google</button>}
    </main>
  )
}

export default Signup