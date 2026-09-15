import React from 'react'

const variants={
    extraBig:"w-40 h-40  shrink-0  rounded-full bg-onPrimary  ",
    big:"w-10 h-10 md:w-20 md:h-20  min-h-18  min-w-18 shrink-0  rounded-full bg-onPrimary  ",
    medium: " w-12 h-12  rounded-full bg-onPrimary  ",
    small:"w-10 h-10  rounded-full bg-onPrimary  ",


} 

function Avatar( {variant="secondaryAvatar" , className="" , src }) {

  return (
    <div className={`overflow-hidden ${className} ${variants[variant]}`}>
      <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    
 
    </div>
    
  )
}

export default Avatar