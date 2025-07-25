import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/Usercontext'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";

import axios from 'axios';


function Customize2  ()  {
    const{userData,backendimage,selectedimage,setUserdata,serverUrl}=useContext(userDataContext)
    const[assistantname,setAssistantname]=useState(userData?.assistantname || "")
    const[loading,setLoading]=useState(false)

    const navigate=useNavigate()

    const handeluploadimage=async()=>{
      setLoading(true)
      try {
        let formdata= new FormData()
        formdata.append("assistantname",assistantname)
        if(backendimage){
          formdata.append("assistantimage",backendimage)
        }
        else{
          formdata.append("imageUrl",selectedimage)
        }
        let result=await axios.post(`${serverUrl}/api/user/update`,
          formdata,{withCredentials:true})
          setLoading(false)
          console.log(result.data)
          setUserdata(result.data)
          navigate("/")
        
      } catch (error) {
        console.log("handeluploadimage error",error);
        setLoading(false)
        
      }

    }
  return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex 
     justify-center items-center flex-col p-[20px] relative'>
      <IoIosArrowRoundBack className='absolute text-white w-[45px] h-[45px] top-[30px] 
      left-[30px] cursor-pointer' onClick={()=>navigate("/customize")} />

        <h1 className='text-white text-[30px] text-center font-semibold mb-[30px]'>
        Enter your <span className='text-blue-500'>Assistant Name</span></h1>
        <input type="email" placeholder="eg. sifhra" className='w-[50%] h-[60px] outline-none 
          border-2 border-white bg-transparent text-white placeholder-gray-400 px-[20px] py-[10px] 
          rounded-full text-[18px]' required onChange={(e)=>setAssistantname(e.target.value)} value={assistantname} />
          {assistantname && <button className='min-w-[150px] h-[60px] mt-[30px] bg-white 
      rounded-full text-black cursor-pointer text-[18px]' 
      onClick={()=>{handeluploadimage()}}>{!loading?"Next":"loading..."}</button> }
           
     </div>
  )
}

export default Customize2