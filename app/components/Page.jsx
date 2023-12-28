import React from 'react'
import SettingSVG from '@/public/gear.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = (props) => {
    const router = useRouter();
    const handlePageRedirect = () => {
        router.push(`/dashboard/${props.pid}`);
    }
    return (
        <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex' onClick={()=>handlePageRedirect()}>
            <div className='w-1/2 h-full flex flex-col justify-between'>
                <span className='text-blue-600 text-3xl font-bold'>{props.pname}</span><br />
                <span className='text-blue-950 text-sm '>{props.timestamp.slice(4, 15)}</span>
            </div>
            <div className='w-1/2 h-full flex items-start justify-end'>
                <Image src={SettingSVG} width={30} height={30} alt='project settings' className='' />
            </div>
        </div>
    )
}

export default Page