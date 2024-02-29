"use client";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Image from "next/image";
import HomeImage from '@/public/home_image.svg';
import HomeImage2 from '@/public/User flow-bro.svg';
import HomeImage3 from '@/public/Working-rafiki.svg';
import HomeImage4 from '@/public/Job hunt-rafiki.svg';
import GithubLogo from '@/public/github-mark.png';

export default function Home() {
  return (
    <main className="scroll-smooth">
      <Navbar />
      {/* Home Section */}
      <section id="home" className="md:flex md:justify-center md:items-center md:m-auto md:mt-10 md:w-screen my-12 container">
        {/* left section */}
        <div className="w-screen p-7 my-14">
          <h1 className="text-5xl font-extrabold">Welcome to Workflow</h1>
          <p className="font-medium mb-3 py-2">Discover the power of visualization</p>
          <Link href='/signup' className="bg-black text-white font-medium py-3 px-6 mt-3 rounded-sm">Get Started</Link>
        </div>
        {/* right section */}
        <div className="w-screen flex justify-center items-center p-3">
          <Image width={340} height={340} src={HomeImage} alt="charts image" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="md:flex md:flex-col md:justify-center md:items-center md:m-auto md:mt-10 md:w-screen my-12 container">
        {/* feature 1 */}
        <div className="my-8 md:flex">
          {/* left section */}
          <div className="bg-slate-200 flex justify-center items-center my-2 md:w-1/2">
            <Image width={340} height={340} src={HomeImage2} alt="" />
          </div>
          {/* right section */}
          <div className="p-3 md:w-1/2 md:flex md:flex-col md:justify-center md:p-7">
            <h3 className="text-slate-500 font-semibold">FEATURES</h3>
            <h2 className="font-bold font-sans text-2xl py-2">Intuitive and efficient design</h2>
            <p className="font-sans">Explore our services: workflow visualizatoin, digital integration, and design solutions.</p>
          </div>
        </div>

        {/* feature 2 */}
        <div className="my-8 md:flex md:flex-row-reverse">
          {/* left section */}
          <div className="bg-slate-200 flex justify-center items-center my-2 md:w-1/2">
            <Image width={340} height={340} src={HomeImage3} alt="" />
          </div>
          {/* right section */}
          <div className="p-3 md:w-1/2 md:flex md:flex-col md:justify-center md:p-7">
            <h3 className="text-slate-500 font-semibold">KEY FEATURES</h3>
            <h2 className="font-bold font-sans text-2xl py-2">Simplicity at its best</h2>
            <p className="font-sans">Out streamlined approach ensures top-notch services. We focus on essentials, delivering results efficiently.</p>
          </div>
        </div>

        {/* feature 3 */}
        <div className="my-8 md:flex">
          {/* left section */}
          <div className="bg-slate-200 flex justify-center items-center my-2 md:w-1/2">
            <Image width={340} height={340} src={HomeImage4} alt="" />
          </div>
          {/* right section */}
          <div className="p-3 md:w-1/2 md:flex md:flex-col md:justify-center md:p-7">
            <h3 className="text-slate-500 font-semibold">HIGHLIGHTS</h3>
            <h2 className="font-bold font-sans text-2xl py-2">Tailored solutions for all needs</h2>
            <p className="font-sans">From startups to enterprises, we cater to diverse requirements. Collaborate with us for customized solutions.</p>
          </div>
        </div>

      </section>
      {/* Footer Section */}
      <footer className="px-10 shadow-inner flex justify-between items-center h-[6rem] container m-auto">
        {/* left section */}
        <div className=""></div>
        {/* right section */}
        <div className="">
          <Link href='https://github.com/Vivekv634'>
            <Image width={40} height={40} src={GithubLogo} alt="github logo" />
          </Link>
        </div>
      </footer>
    </main>
  )
}
