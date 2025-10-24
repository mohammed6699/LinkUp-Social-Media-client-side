import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import SideBar from '../components/SideBar';
import Loading from '../components/Loading';
function Layout() {
  const [sideBar, setSideBar] = useState(false)
  const user = dummyUserData
  return user ? (
      <div className='flex w-full h-screen'>
        
        <SideBar 
          sideBar={sideBar} 
          setSideBar={setSideBar}
        />
        
        <div className='flex-1 bg-slate-50'>
          <Outlet />
        </div>
        {sideBar ? <X className='absolute top-3 right-3 p-2 z-100 bg-black rounded-md shadow w-10 h-10 text-gray-100 sm:hidden' 
        onClick={() => setSideBar(true)}/>
        : <Menu 
        className='absolute top-3 right-3 p-2 z-100 bg-black rounded-md shadow w-10 h-10 text-gray-100 sm:hidden'
        onClick={() => setSideBar(true)}/>
        }
      </div>
  ): (
      <Loading />
  )
}

export default Layout