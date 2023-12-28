import React from 'react';

const AddPage = () => {
  return (
      <div className='bg-slate-200 p-4 m-3 rounded-xl h-32 flex md:w-2/4 lg:w-1/3 items-center flex-col hover:bg-slate-300'>
          <span className='h-16 w-16 rounded-full border-[6px] border-blue-600 bg-transparent'>
              <span className='text-5xl flex justify-center items-center text-blue-600'>+</span>
          </span>
          <span>New Page</span>
      </div>
  )
}

export default AddPage