import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Customize from './pages/Customize'
import { userDataContext } from './context/Usercontext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'



function App () {
  const{userdata,setUserdata}=useContext(userDataContext)
  return (
    <Routes>
      <Route path='/' element={(userdata?.assistantimage && userdata?.assistantname)?<Home/>:<Navigate to={"/customize"}/>}/>
      <Route path='/signup' element={!userdata?<Signup/>:<Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userdata?<Signin/>:<Navigate to={"/"}/>}/>
      <Route path='/customize' element={userdata?<Customize/>:<Navigate to={"/signup"}/>}/>
      <Route path='/customize2' element={userdata?<Customize2/>:<Navigate to={"/signup"}/>}/>

    </Routes>
  )
}

export default App
