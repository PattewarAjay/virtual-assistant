import React, { useState, useRef, useContext } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/Usercontext'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";




const Customize = () => {
  const{serverUrl,userdata,setUserdata,loading,frontendimage, setFrontendimage,
        backendimage, setBackendimage,selectedimage,setSelectedimage}=useContext(userDataContext)
  
  const inputimage=useRef()
  const navigate=useNavigate()


  const handelimage=(e)=>{
    const file=e.target.files[0]
    setBackendimage(file)
    setFrontendimage(URL.createObjectURL(file))
  }


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex 
     justify-center items-center flex-col p-[20px]'>
      <IoIosArrowRoundBack className='absolute text-white w-[45px] h-[45px] top-[30px] 
            left-[30px] cursor-pointer' onClick={()=>navigate("/")} />

      <h1 className='text-white text-[30px] text-center font-semibold mb-[30px]'>
        Select your <span className='text-blue-500'>Assistant Image</span></h1>
      <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[15px]'>

      <Card image={image1}/>
      <Card image={image2}/>
      <Card image={image3}/>
      <Card image={image4}/>
      <Card image={image5}/>
      <Card image={image6}/>
      <Card image={image7}/>
      <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]  bg-[black] border-2 border-[#0000ff66] rounded-2xl 
      overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer
      hover:border-3 hover:border-white flex items-center justify-center  
      ${selectedimage=="input"?"border-3 border-white shadow-2xl shadow-blue-900":null}`} 
      onClick={()=>{inputimage.current.click();
       setSelectedimage("input")}}>


        {!frontendimage && <RiImageAddLine className='text-[white] w-[25px] h-[25px]'/>}
        {frontendimage &&  <img src={frontendimage} alt="" className=' h-full object-cover' />}
    
    </div>
    <input type="file" accept='image/*' ref={inputimage} hidden onChange={handelimage} />
      </div>

      {selectedimage && <button className='min-w-[150px] h-[60px] mt-[30px] bg-white 
      rounded-full text-black cursor-pointer text-[18px]' onClick={()=>navigate("/customize2")}>Next</button>}
    
    </div>
  )
}

export default Customize