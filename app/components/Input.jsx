import React from 'react'

const Input = (props) => {
    return (
        <div className='mb-2'>
            <label className='block' htmlFor={props.id}>{props.label}</label>
            <input className='border shadow-md my-1 p-2 py-3 text-lg w-full outline-none focus:outline-none'
                type={`${props.type ? props.type : "text"}`}
                id={props.id} placeholder={props.placeholder}
                required={props.required}
                value={props.value}
                onChange={e => props.setValue(e.target.value)}
            />
        </div>
    )
}

export default Input