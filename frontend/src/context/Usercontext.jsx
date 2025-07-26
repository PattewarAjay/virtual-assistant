import React, { createContext,useEffect,useState } from 'react'
import axios from 'axios'
export const userDataContext = createContext()

function Usercontext ({children}){
    const serverUrl="https://virtual-assistant-backend-en6a.onrender.com"
    const[userdata,setUserdata] = useState(null)
    const [loading, setLoading] = useState(true);
    const[frontendimage, setFrontendimage]=useState(null)
    const[backendimage, setBackendimage]=useState(null)
    const[selectedimage,setSelectedimage]=useState(null)

    const handelCurrentuser = async()=>{
      try {
        const result=await axios.get(`${serverUrl}/api/user/current`,{
          withCredentials:true})
          setUserdata(result.data)
          console.log(result.data)
      } catch (error) {
        console.log(error)
      }finally {
      setLoading(false); // FINISH LOADING
    }
    }

    const getGeminiResponse = async(command)=>{
      try {
        const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command}, {
    headers: {
      Authorization: `Bearer ${token}`
    }},{withCredentials:true})
        return result.data
      } catch (error) {
        console.log(error);
        
      }
    }

    useEffect(()=>{handelCurrentuser()},[])

    const value={
        serverUrl,userdata,setUserdata,loading,frontendimage, setFrontendimage,
        backendimage, setBackendimage,selectedimage,setSelectedimage, getGeminiResponse
    }
  return (
    
    <userDataContext.Provider value={value}>

        {children}
    </userDataContext.Provider>

  )
}

export default Usercontext
