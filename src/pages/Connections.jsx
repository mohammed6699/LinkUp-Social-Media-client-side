import React, { useState, useEffect } from 'react'
import {Users, UserPlus, UserCheck, UserRoundPen, MessageSquare, Search} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchConnections } from '../features/connections/connection-slice';
import Loading from '../components/Loading';

function Connections() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { connections, followers, following, pendingConnections, status } = useSelector((state) => state.connection);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      dispatch(fetchConnections(token));
    };
    fetchData();
  }, [dispatch, getToken]);

  const dataArray =  [
    {label: 'Followers', value: followers, icon: Users},
    {label : "Following", value: following, icon: UserCheck},
    {label : "Pending Connections", value: pendingConnections, icon: UserRoundPen},
    {label : "All Connections", value: connections, icon: UserPlus}
  ]
  const [currentTab, setCurrentTab] = useState('Followers')

  const filteredUsers = dataArray.find((item) => item.label === currentTab)?.value.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return status === 'loading' ? <Loading /> : (
    <div className='min-h-screen bg-slate-100'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title and Search */}
        <div className='mb-8 flex justify-between items-center'>
            <div>
                <h1 className='text-3xl font-bold text-slate-800 mb-2'>Connections</h1>
                <p className='text-slate-500'>Manage your connection and connect to new People</p>
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 pl-10 border rounded-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
        </div>
        {/* counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-60 border-gray-200 rounded-md'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>
        {/* labels for tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 bg-white rounded-sm p-2'>
            {dataArray.map((item) => (
              <button key={item.label}
              onClick={() => setCurrentTab(item.label)}
              className={`flex items-center px-4 py-2 text-sm rounded-md text-slate-700 transition-colors ${currentTab === item.label ? 'bg-white font-medium text-black hover:text-gray-800' : 'text-gray-300 hover:text-black'}`}
              >
                <item.icon className='text-black w-4 h-4'/>
                <span className='ml-1 text-slate-600'>{item.label}</span>
                {item.count !== undefined &&
                  <span className='ml-2 text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full'>{item.count}</span>
                }
              </button>
            ))}
        </div>
        {/* connections */}
        <div className='flex flex-wrap gap-6 mt-5'>
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id}
                className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'
              >
                <img src={user.profile_picture} alt='user profile picture' 
                  className='rounded-full w-12 h-12 shadow-md mx-auto'
                />
                <div className='flex-1'>
                  <p className='font-medium text-slate-700'>{user.full_name}</p>
                  <p className='text-slate-700'>{user.username}</p>
                  <p className='text-sm text-gray-400'>{user.bio.slice(0, 40)}...</p>
                  <div className='flex max-sm:flex-col gap-2 mt-4'>
                    {
                      <button className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                      onClick={() => navigate(`/profile/${user._id}`)}
                      >
                          view profile
                      </button>
                    }
                    {
                      (currentTab === 'Followers' || currentTab === 'Following') && (
                        <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer
                      flex items-center justify-center gap-1
                      '
                        >
                          <MessageSquare className='w-4 h-4'/>
                          Message
                        </button>
                      )
                    }
                    {
                      currentTab === 'Following' && (
                        <button
                        className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                        >
                          Unfollow
                        </button>
                      )
                    }
                    {
                      currentTab === 'Pending Connections' && (
                        <button
                        className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                        >
                          Accept
                        </button>
                      )
                    }
                    {
                      currentTab === 'All Connections' && (
                        <button
                        onClick={() => navigate(`messages/${user._id}`)}
                        className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer
                      flex items-center justify-center gap-1
                      '
                        >
                          <MessageSquare className='w-4 h-4'/>
                          Message
                        </button>
                      )
                    }
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Connections