import React from 'react'
import SettingSVG from '@/public/gear.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = (props) => {
    const router = useRouter();
    const handlePageRedirect = () => {
        router.push(`/dashboard/pages/${props.pid}`);
    }
    return (
        <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex md:w-2/4 lg:w-1/3 hover:bg-slate-300 cursor-pointer'>
            <div className='w-10/12 h-full flex flex-col justify-between' onClick={() => handlePageRedirect()} title={props.pname}>
                <span className='text-blue-600 text-3xl font-bold w-full text-ellipsis text-nowrap overflow-hidden'>{props.pname}</span>
                <span className='text-blue-950 text-sm '>{props.timestamp.slice(4, 15)}</span>
            </div>
            <div className='w-2/12 h-full flex items-start justify-end'>
                <Image src={SettingSVG} width={30} height={30} alt='project settings' className='' />
            </div>
        </div>
    )
}

export default Page