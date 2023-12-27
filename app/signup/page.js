"use client";
import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { auth, db } from '@/config/firebase';
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
const googleProvider = new GoogleAuthProvider();

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const workflow = collection(db, "workflow");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        uid: user?.uid,
        name: name,
        email: user?.email,
        photoURL: user?.photoURL,
        isverified: user?.emailVerified,
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
      await updateProfile(user, { displayName: name });

      await addDoc(workflow, userData).then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/');
          }
        })
      }).catch(err => console.log(err))
    } catch (err) {
      console.error(err);
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const userData = {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
        photoURL: user?.photoURL,
        isverified: user?.emailVerified,
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
      console.error(err);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    })
  })
  return (
    <main>
      <form>
        <input type="text" placeholder='Enter your name' value={name} onChange={(e) => (setName(e.target.value))} required={true} />
        <input type="email" placeholder='Enter your email' value={email} onChange={(e) => (setEmail(e.target.value))} required={true} />
        <input type="password" placeholder='Enter your password' value={password} onChange={(e) => (setPassword(e.target.value))} required={true} />
        <input type="submit" value="Submit" onClick={handleSubmit} />
      </form>
      <button type="button" onClick={handleGoogleSignup}>Sigup with google</button>
    </main>
  )
}

export default Signup