import React from 'react'

const Loading = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
        <div className='h-20 w-20 border-[10px] border-slate-200 border-t-blue-600 animate-spin rounded-full'></div>
    </div>
  )
}

export default Loading