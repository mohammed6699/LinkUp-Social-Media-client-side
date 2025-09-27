import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut, User } from 'lucide-react'
import {UserButton, useClerk, useUser} from "@clerk/clerk-react"
function SideBar({sideBar, setSideBar}) {
  const navigate = useNavigate()
  const {user} = useUser() 
  const {signOut} = useClerk()
  // const email = user.primaryEmailAddress?.emailAddress
  const name = user.fullName
  const userName = user.fullName
  return (
    <div className={`w-60 xl:w-72 h-full bg-white border-r border-gray-200 flex flex-col justify-between items-center
     max-sm:absolute top-0 bottom-0 z-20 ${sideBar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all
     duration-300 ease-in-out`}>
        <div className='w-full'>
          <img onClick={() => navigate('/')} src={assets.logo} alt='logo image' className='w-26 ml-10 my-2 cursor-pointer' />
          <hr className='mb-8 border-gray-300'/>
          <MenuItems setSideBar={setSideBar}/>
          <Link to='/create-post' className='m-6 px-4 py-2 bg-indigo-500 text-white rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-700'>
            <CirclePlus className='w-8 h-8'/>
            create Post 
          </Link>
        </div>
        <div className='w-full border-t border-gray-300 p-4 px-7 flex items-center justify-between'
        >
          <div className='flex gap-2 items-center cursor-pointer'>
            <UserButton />
            <div>
              <h1 className='text-sm font-medium'>{name}</h1>
              <p className='text-xs text-gray-600'>@{userName}</p>
            </div>
          </div>
          <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
        </div>
    </div>
  )
}

export default SideBar