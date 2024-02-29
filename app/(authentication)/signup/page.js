"use client";
import React, { useEffect, useState } from "react";
import { uid } from "uid";
import { auth, db } from "@/config/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Link from "next/link";


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const workflow = collection(db, "workflow");
  const router = useRouter();

  // checks if the user is already signedup/signedin or not
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
  })

  // handling email and password signup
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
        photoURL: `https://source.boringavatars.com/beam/120/${name}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`,
        pages: [
          {
            pid: uid(20),
            pname: "Project 1",
            timestamp: Date(),
            update_timestamp: Date(),
            nodes: [],
            edges: [],
          },
        ],
      };
      await addDoc(workflow, userData)
        .then(() => {
          alert("signed successfully");
        })
        .catch((err) => console.log(err));
    } catch (err) {
      alert(err);
    }
  };


  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-1 text-center">Sign up</h1>
      <h3 className="mb-2 text-center">Enter your details to get started</h3>
      <form className="w-11/12 md:w-full max-w-sm min-w-fit" onSubmit={handleFormSubmit}>
        <Input value={name} setValue={setName} id="name" label="Full Name" placeholder="Your Full Name" required={true} />
        <Input value={email} setValue={setEmail} id="email" label="Email" placeholder="Your Email Address" required={true} />
        <Input value={password} setValue={setPassword} id="password" type="password" label="Password" placeholder="Your new password" required={true} />
        <Input value={cpassword} setValue={setCPassword} id="cpassword" type="password" label="Confirm Password" placeholder="Confirm your password" required={true} />
        <button className="bg-black text-white w-full my-3 py-3 rounded-sm font-bold" type="submit">Join now</button>
      </form>
      <p>Already a member? <Link href='/login' className="font-semibold underline">Log In</Link></p>
    </main>
  );
};

export default Signup;
