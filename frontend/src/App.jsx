import React from 'react'
import "./App.css"
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import SideBar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import Notifications from './pages/Notifications/Notifications'
import Profile from './pages/Profile/Profile'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './constant/url'
import LoadingSpinner from './components/common/LoadingSpinner'

const App = () => {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        })
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "somthing went wrong")

        return data;
      } catch (error) {
        throw error
      }
    },
    retry: false
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }


  return (
    <>
      <div className='flex'>
        {authUser && <SideBar />}
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
          <Route path='/notifications' element={authUser ? <Notifications /> : <Navigate to={"/login"} />} />
          <Route path='/profile/:username' element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
        </Routes>
        {authUser && <RightPanel />}
        <Toaster />
      </div>
    </>
  )
}

export default App