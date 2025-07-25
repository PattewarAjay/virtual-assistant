import React, { useContext } from 'react'
import { userDataContext } from '../context/Usercontext'

function Card ({image})  {

  
    const{serverUrl,userdata,setUserdata,loading,frontendimage, setFrontendimage,
    backendimage, setBackendimage,selectedimage,setSelectedimage}=useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[black] border-2 border-[#0000ff66] rounded-2xl overflow-hidden
    hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-3 
    hover:border-white ${selectedimage==image?"border-3 border-white shadow-2xl shadow-blue-900":null}`} 
    onClick={()=>{
      setSelectedimage(image)
      setFrontendimage(null)
      setBackendimage(null)


     }}>
        <img src={image} alt="" className='h-full object-cover' />
    </div>
  )
}
    
export default Card