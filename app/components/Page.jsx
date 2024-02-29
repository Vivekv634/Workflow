import React, { useState } from 'react'
import SettingPNG from '@/public/menu.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, workflow } from '@/config/firebase';
import { doc, getDocs, updateDoc } from 'firebase/firestore';

const Page = (props) => {
    const [popup, setPopup] = useState(false);
    const [id, setId] = useState('');
    let [pages, setPages] = useState([]);
    const router = useRouter();

    const handlePageRedirect = () => {
        router.push(`/dashboard/pages/${props.pid}`);
    }

    // getting and setting signedin user's id and pages
    onAuthStateChanged(auth, (user) => {
        if (user) {
            getDocs(workflow).then((response) => {
                response.docs.map(item => {
                    if (item.data().email == user.email) {
                        setId(item.id);
                        setPages(item.data().pages)
                    }
                })
            })
        }
    })

    // page rename handling function
    const handleRenamePage = async (pid) => {
        const docRef = doc(db, "workflow", id);
        let updatedPages = pages.map(page => {
            if (page.pid == pid) {
                page.pname = rename;
                return page;
            }
            return page;
        })
        await updateDoc(docRef, { pages: updatedPages })
            .then(() => {
                alert("Name updated!");
                window.location.reload();
            })
        setFocus(false);
        setDisable(true);
    }

    // page delete handling function
    const handleDeletePage = async (pid) => {
        const response = confirm(`Really wanted to delete ${props.pname}?`);
        try {
            if (response) {
                const docRef = doc(db, "workflow", id);
                await updateDoc(docRef, {
                    pages: pages.filter(page => page.pid != pid)
                }).then(() => {
                    alert('page deleted!');
                    window.location.reload();
                })
            } else {
                setPopup(!popup);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='bg-gray-200 p-4 m-3 rounded-xl h-32 w-screen flex transition-all md:w-64 hover:bg-gray-300'>
            <div className='w-11/12 h-full flex flex-col justify-between' title={props.pname}>
                <span className='text-black bg-transparent text-3xl font-bold w-full text-ellipsis text-nowrap overflow-hidden'>{props.pname}</span>
                <span className='text-blue-950 text-sm '>{props.timestamp.slice(4, 15)}</span>
            </div>
            <div className='w-1/12 h-full flex items-start justify-end'>
                <div>
                    <Image src={SettingPNG} width={20} height={20} alt='project settings' className='cursor-pointer' onClick={() => setPopup(!popup)} />
                </div>
                <ul className={`absolute ${popup ? 'block' : 'hidden'}  bg-slate-50 p-1 mt-9 w-36 border rounded-lg`}>
                    <li className='hover:bg-slate-100 p-[4px] rounded-md cursor-pointer' onClick={() => handlePageRedirect()}>Open Page</li>
                    <li className='hover:bg-slate-100 p-[4px] rounded-md cursor-pointer' onClick={() => { setDisable(false), setPopup(!popup), setFocus(true) }}>Rename</li>
                    <li className='text-red-600 hover:bg-slate-100 p-[4px] rounded-md cursor-pointer' onClick={() => { handleDeletePage(props.pid) }}>Delete</li>
                </ul>
            </div>
        </div>
    )
}

export default Page