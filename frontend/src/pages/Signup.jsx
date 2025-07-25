import React, { useState, useContext } from 'react'
import bg from '../assets/authBg.png'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/Usercontext.jsx'
import axios from 'axios';




const Signup = () => {

  const{serverUrl,userdata,setUserdata}=useContext(userDataContext)
  const[showpassword, setShowPassword] = useState(false)
  const[err, setErr]=useState('')
  const[loading,setLoading]=useState(false)
  const[name, setName] = useState('')
  const[email, setEmail] = useState('')
  const[password, setPassword]=useState('')
  const navigate=useNavigate()
  const handelSignUp=async(e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result=await axios.post(`${serverUrl}/api/auth/signup`,{
        name,
        email,
        password
      },{withCredentials:true}) 
      setUserdata(result.data)
      setLoading(false)
      navigate('/customize')

    } catch (error) {
      console.log(error)
      setUserdata(null)
      setLoading(false)
      
    }

  }
  return (
    <div className='w-full h-[100vh] bg-cover flex items-center justify-center' style={{backgroundImage: `url(${bg})`}}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[rgba(0, 0, 0, 0.48)] 
      backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]'
      onSubmit={handelSignUp}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to 
          <span className='text-blue-500'>Virtual Assistant</span></h1>
          <input type="text" placeholder="Enter your Name" className='w-full h-[60px] outline-none 
          border-2 border-white bg-transparent text-white placeholder-gray-400 px-[20px] py-[10px] 
          rounded-full text-[18px]' required onChange={(e)=>setName(e.target.value)} value={name}/>
          <input type="email" placeholder="Email" className='w-full h-[60px] outline-none 
          border-2 border-white bg-transparent text-white placeholder-gray-400 px-[20px] py-[10px] 
          rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email} />
          <div className='w-full h-[60px] border-2 border-white bg-transparent text-white 
          rounded-full text-[18px] relative'>
            <input type={showpassword ? "text" : "password"} placeholder='password' className='w-full h-full outline-none 
            bg-transparent text-white placeholder-gray-400 px-[20px] py-[10px] rounded-full text-[18px] ' 
            required onChange={(e)=>setPassword(e.target.value)} value={password} />
            {!showpassword &&  <IoEye className='absolute top-[16px] right-[22px] text-[white] w-[25px] h-[25px] cursor-pointer' 
             onClick={()=>setShowPassword(true)}/>}
             {showpassword &&  <IoEyeOff className='absolute top-[16px] right-[22px] text-[white] w-[25px] h-[25px] cursor-pointer' 
             onClick={()=>setShowPassword(false)}/>}

          </div>
          {err.length > 0 && <p className='text-red-500'>*{err}</p>}
          <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black text-[18px]' 
          disabled={loading}>{loading?'Loading...':'SignUp'}</button>
          <p className='text-white text-[18px]' onClick={()=>navigate('/signin')}>Already have an account? <span className='text-blue-500'>SignIn</span></p>
      </form>
    </div>
  )
}

export default Signup