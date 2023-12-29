import React, { useState } from 'react'
import SettingSVG from '@/public/gear.svg';
import CloseSVG from '@/public/close.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, workflow } from '@/config/firebase';
import { FieldValue, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

const Page = (props) => {
    const [popup, setPopup] = useState(false);
    const [id, setId] = useState('');
    const [pages, setPages] = useState([]);
    const [rename, setRename] = useState(props.pname);
    const [disable, setDisable] = useState(true);
    const [hideClose, setHideClose] = useState(true);
    const router = useRouter();

    const handlePageRedirect = () => {
        router.push(`/dashboard/pages/${props.pid}`);
    }

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

    const handleRenamePage = async (pid) => {
        // const docRef = doc(db, "workflow", id);
        // await updateDoc(docRef, {

        // })
        console.log(pid)

    }

    const handleDeletePage = async (pid) => {
        const response = confirm(`Really wanted to delete ${props.pname}?`);
        if (response) {
            const docRef = doc(db, "workflow", id);
            await updateDoc(docRef, {
                pages: pages.filter(page => page.pid != pid)
            }).then(() => {
                alert('page deleted!')
            })
        } else {
            setPopup(!popup);
        }
    }

    return (
        <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex md:w-2/4 lg:w-1/3 hover:bg-slate-300'>
            <div className='w-11/12 h-full flex flex-col justify-between' title={props.pname}>
                <input className='text-blue-600 bg-transparent text-3xl font-bold w-full text-ellipsis text-nowrap overflow-hidden' autoFocus={true} disabled={disable} value={rename} onKeyUp={(e) => { e.key == "Enter" && handleRenamePage(props.pid) }} onChange={(e) => { setRename(e.target.value) }} />
                <span className='text-blue-950 text-sm '>{props.timestamp.slice(4, 15)}</span>
            </div>
            <div className='w-1/12 h-full flex items-start justify-end'>
                <div>
                    <Image src={CloseSVG} width={30} height={30} alt='close rename button' className={`${hideClose ? "hidden" : ""} cursor-pointer`} onClick={() => { setDisable(true) }} />
                    <Image src={SettingSVG} width={30} height={30} alt='project settings' className='cursor-pointer' onClick={() => setPopup(!popup)} />
                </div>
                <ul className={`absolute ${popup ? 'block' : 'hidden'}  bg-white p-1 mt-9 w-36 border rounded-lg`}>
                    <li className='hover:bg-slate-100 px-1 py-[2px] rounded-md cursor-pointer' onClick={() => handlePageRedirect()}>Open Page</li>
                    <li className='hover:bg-slate-100 px-1 py-[2px] rounded-md cursor-pointer' onClick={() => { setDisable(false), setPopup(!popup) }}>Rename</li>
                    <li className='text-red-600 hover:bg-slate-100 px-1 py-[2px] rounded-md cursor-pointer' onClick={() => { handleDeletePage(props.pid) }}>Delete</li>
                </ul>
            </div>
        </div>
    )
}

export default Page