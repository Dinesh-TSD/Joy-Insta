import "./App.css"
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Search from './pages/Search/Search'
import Explore from './pages/Explore/Explore'
import Reels from './pages/Reels/Reels'
import Messages from './pages/Messages/Messages'
import Notifications from './pages/Notifications/Notifications'
import Create from './pages/Create/Create'
import Dashboard from './pages/Dashboard/Dashboard'
import Profile from './pages/Profile/Profile'
import More from './pages/More/More'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import SideBar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './constant/url'
import LoadingSpinner from './components/common/LoadingSpinner'

const App = () => {

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

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
      {/* Pages without layout (Login/Signup) */}
      {isAuthPage ? (
        <>
          <Routes>
            <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
            <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
          </Routes>
          <Toaster />
        </>
      ) : (
        // Pages with layout (Sidebar, RightPanel, Margin)
        <div className='flex bg-[#040408] text-white p-4 ml-20 sm:ml-64'>
          {authUser && <SideBar />}
          <Routes>
            <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
            <Route path='/search' element={authUser ? <Search /> : <Navigate to="/login" />} />
            <Route path='/explore' element={authUser ? <Explore /> : <Navigate to="/login" />} />
            <Route path='/reels' element={authUser ? <Reels /> : <Navigate to="/login" />} />
            <Route path='/messages' element={authUser ? <Messages /> : <Navigate to="/login" />} />
            <Route path='/notifications' element={authUser ? <Notifications /> : <Navigate to="/login" />} />
            <Route path='/create' element={authUser ? <Create /> : <Navigate to="/login" />} />
            <Route path='/dashboard' element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path='/profile/:username' element={authUser ? <Profile /> : <Navigate to="/login" />} />
            <Route path='/more' element={authUser ? <More /> : <Navigate to="/login" />} />
          </Routes>
          {authUser && <RightPanel />}
          <Toaster />
        </div>
      )}
    </>
  )
}

export default App