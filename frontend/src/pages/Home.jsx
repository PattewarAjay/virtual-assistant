import React, { useContext, useEffect,  } from 'react'
import { userDataContext } from '../context/Usercontext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useRef } from 'react'
import { CgMenuRight } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import usergif from '../assets/user.gif'
import aigif from '../assets/ai.gif'


function Home () {
  const {userdata,serverUrl,setUserdata,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const[listening,setListening]=useState(false)
  const[usertext,setUsertext]=useState('')
  const[aitext,setAitext]=useState('')
  const[ham,setHam]=useState(false)
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const synth=window.speechSynthesis
  const isRecognizingRef=useRef(false)
  

  const handlelogout=async()=>{
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserdata(null)
      navigate('/signin')
      
    } catch (error) {
      setUserdata(null)
      console.log(error);
      
    }
  }

  const startRecognition=()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){

      try {
          recognitionRef.current?.start()
          console.log("Recognition started");
      } catch (error) {
        if(!error.message.includes("start")){
          console.error("start error:",error);
          
        }
      }
    }
  }

  const speak=(text)=>{
    const utterance=new SpeechSynthesisUtterance(text)
    utterance.lang='hi-IN'
    const voices=window.speechSynthesis.getVoices()
    const hindiVoice=voices.find(voice=>voice.lang==='hi-IN')
    if(hindiVoice){
      utterance.voice=hindiVoice
    }
    isSpeakingRef.current=true
    utterance.onend=()=>{
      setAitext("")
      isSpeakingRef.current=false
      setTimeout(()=>{
        startRecognition()
      },800)
    }
    synth.cancel()
    synth.speak(utterance)
  }

  const handelcommand=(data)=>{
    const{type,userInput,response}=data
    speak(response)


     if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
     if (type === 'calculator-open') {
  
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
     if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type ==="facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if (type ==="weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    if (type === 'wikipedia-search') {
  const query = encodeURIComponent(userInput);
  window.open(`https://en.wikipedia.org/wiki/${query}`, '_blank');
}

if (type === 'gmail-open') {
  window.open(`https://mail.google.com/`, '_blank');
}

if (type === 'calendar-open') {
  window.open(`https://calendar.google.com/`, '_blank');
}

if (type === 'chatgpt-open') {
  window.open(`https://chat.openai.com/`, '_blank');
}

if (type === 'whatsapp-open') {
  window.open(`https://web.whatsapp.com/`, '_blank');
}

if (type === 'pinterest-open') {
  window.open(`https://www.pinterest.com/`, '_blank');
}

if (type === 'unit-converter-open') {
  window.open(`https://www.google.com/search?q=unit+converter`, '_blank');
}

if (type === 'spotify-open') {
  window.open(`https://open.spotify.com/`, '_blank');
}

if (type === 'google-trends') {
  window.open(`https://trends.google.com/trends/`, '_blank');
}

if (type === 'google-maps-open') {
  window.open(`https://www.google.com/maps`, '_blank');
}

  }



  useEffect(()=>{
    const SpeechRecognition= window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition= new SpeechRecognition()
    recognition.continuous=true,
    recognition.lang='en-US'
    recognition.interimResults=false

    recognitionRef.current=recognition

    
    let isMounted=true
    

    // Start recognition after 1 second delay only if component still mounted
  const startTimeout = setTimeout(() => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition requested to start");
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 1000);

    const safeRecognition=()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try {
           recognition.start()
        } catch (error) {
          if(error.name !== "InvalidStateError"){
            console.log(" start error:",error)
          }
        }
        }
      }

      recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    if (isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };
    

    recognition.onresult=async(e)=>{
      const transcript=e.results[e.results.length-1][0].transcript.trim()

      if(transcript.toLowerCase().includes(userdata.assistantname.toLowerCase())){
        setAitext("")
        setUsertext(transcript)
        recognition.stop()
        isRecognizingRef.current=false
        setListening(false)
        const data= await getGeminiResponse(transcript)
        handelcommand(data)
        setAitext(data.response)
        setUsertext("")
      }
    }

    const fallback=setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
    },1000)
    safeRecognition()

    
      const greeting= new SpeechSynthesisUtterance(`Hello ${userdata.name} What can i help you with`)
      greeting.lang='hi-IN'
      
      window.speechSynthesis.speak(greeting)
   

    return ()=>{
      isMounted=false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current=false
      clearInterval(fallback) 
    }
    
  },[])
  
    

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex
     justify-center items-center flex-col gap-[15px] overflow-hidden'>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] cursor-pointer
      w-[30px] h-[30px]' onClick={()=>setHam(true)} />
      <div className={`absolute lg:hidden top-0 h-full w-full bg-[#00000053] backdrop-blur-lg p-[20px]
      flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
        <RxCross2  className='text-white absolute top-[20px] right-[20px] cursor-pointer
      w-[30px] h-[30px] ' onClick={()=>setHam(false)}/>

      <button className='min-w-[100px] h-[40px]  mt-[30px] bg-white 
      rounded-full  text-black cursor-pointer text-[18px] '
      onClick={handlelogout} >Logout</button>
      <button className='min-w-[100px] h-[40px] mt-[30px] bg-white 
      rounded-full text-black cursor-pointer text-[18px] 
      flex items-center justify-center  px-[20px] py-[10px] '
      onClick={()=>navigate("/customize")} >Customize Assitant</button>
      <div className='w-full h-[2px] bg-gray-400 '></div>
      <h1 className='text-white text-[20px]  left-[20px] font-semibold'>History</h1>
      <div className='w-full h-[400px] overflow-y-auto  gap-[20px] flex flex-col'>
        {userdata.history?.map((his)=>(<span className='text-gray-200 text-[18px] turncate'>{his}</span>))}
      </div>
      </div>
        <button className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold absolute hidden lg:block 
        top-[20px] right-[20px]  bg-white rounded-full cursor-pointer 
        text-[19px] px-[20px] py-[10px]' onClick={handlelogout}>Log Out</button>
      <button className='min-w-[150px] h-[50px] mt-[30px] text-black 
      font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full 
      cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize Assistant</button>
    <div className='w-[250px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
    <img src={userdata?.assistantimage} alt="" className='h-full object-cover'/>
      </div>
    <h1 className='text-white text-[20px] font-semibold'>I'm {userdata?.assistantname}</h1>
    {!aitext && <img src={usergif} alt="" className='w-[200px] ' /> }
    {aitext && <img src={aigif} alt="" className='w-[200px] '/> }
    <h1 className='text-white text-[18px] font-semibold text-wrap'>{usertext?usertext:aitext?aitext:null}</h1>
     </div>
  )
}

export default Home