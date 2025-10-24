import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { followUser, unfollowUser, sendConnectionRequest } from '../features/user/user-slice';
import { useNavigate } from 'react-router-dom';

function UserCard({user}) {
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const currentUser = useSelector(state => state.user.value);
    const navigate = useNavigate();

    const handleFollow = async() => {
        const token = await getToken();
        if (currentUser?.following.includes(user._id)) {
            dispatch(unfollowUser({ token, id: user._id }));
        } else {
            dispatch(followUser({ token, id: user._id }));
        }
    }

    const handleConnectionRequest = async() => {
        if (currentUser?.connections.includes(user._id)) {
            navigate(`/messages/${user._id}`);
        } else {
            const token = await getToken();
            dispatch(sendConnectionRequest({ token, id: user._id }));
        }
    }

  return (
    <div 
    key={user._id}
    className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
        <div className='text-center'>
            <img src={user.profile_picture} alt='' 
            className='rounded-full w-16 shadow-md mx-auto'
            />
            <p className='mt-4 font-semibold'>{user.full_name}</p>
            {user.username && <p className='text-gray-500 font-light'>@{user.username}</p>}
            {user.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'>{user.bio}</p>}
        </div>
        <div className='flex items-center justify-center gap-2 mt-3 text-sm'>
            <div className='flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1'>
                <MapPin className='w-4 h-4'/> {user.location}
            </div>
            <div className='flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1'>
                <span>{user.followers.length}</span> followers
            </div>
        </div>
        <div className='flex mt-4 gap-2'>
            {/* follow button */}
            <button
            onClick={handleFollow}
            className='w-full py-2 flex justify-center items-center gap-2 border rounded-md bg-gradient-to-r from-indigo-500 to-purple-600
            hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white transition-all cursor-pointer'>
                <UserPlus className='w-4 h-4'/>{currentUser?.following.includes(user._id) ? 'Following': "Follow"}
            </button>
            {/* message button */}
            <button
            onClick={handleConnectionRequest}
            className='flex items-center justify-center w-16
            border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition'
            >
                {currentUser?.connections.includes(user._id) ? <MessageCircle className='w-4 h-4 group-hover:scale-95 transition'/> 
                : <Plus className='w-4 h-4 group-hover:scale-95 transition'/> }
            </button>
        </div>
    </div>
  )
}

export default UserCard