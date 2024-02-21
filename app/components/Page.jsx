import React, { useState, useRef, useEffect } from 'react'
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
    const [rename, setRename] = useState(props.pname);
    const [disable, setDisable] = useState(true);
    const [focus, setFocus] = useState(false);
    const router = useRouter();
    const inputRef = useRef();

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

    useEffect(() => {
        inputRef.current.select();
    }, [focus])

    return (
        <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex md:w-2/4 lg:w-1/3 hover:bg-slate-300'>
            <div className='w-11/12 h-full flex flex-col justify-between' title={props.pname}>
                <input className={`${focus ? 'border-2 border-blue-900 rounded-md' : ''} text-blue-600 bg-transparent text-3xl font-bold w-full text-ellipsis text-nowrap overflow-hidden`}
                    autoFocus={true}
                    disabled={disable}
                    placeholder='Page Name'
                    ref={inputRef}
                    value={rename}
                    onKeyUp={(e) => { e.key == "Enter" && handleRenamePage(props.pid), e.key == "Escape" && (setDisable(true), setFocus(false)) }}
                    onChange={(e) => { setRename(e.target.value) }} />
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