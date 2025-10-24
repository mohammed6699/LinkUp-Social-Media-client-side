import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react';
import Loading from '../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchUsers } from '../features/discover/discover-slice';
import UserCard from '../components/UserCard';

function Discover() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { users, status } = useSelector((state) => state.discover);

  const handleSearch = async(e) => {
    if(e.key === 'Enter'){
      const token = await getToken();
      dispatch(fetchUsers({token, input}));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      dispatch(fetchUsers({token}));
    };
    fetchData();
  }, [dispatch, getToken]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-slate-800 mb-2'>Discover Page</h1>
            <p className='text-slate-500'>Connect with amazing people and grow your network</p>
        </div>
        {/* Search */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200 bg-white '>
            <div className='p-6'>
              <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6'/> 
                  <input type='text'
                  placeholder='search people by name, username, bio, location...'
                  className='pl-10 w-full sm:pl-12 py-2 border border-slate-200 rounded-md max-sm:text-sm'
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  onKeyUp={handleSearch}
                  />
              </div>
            </div>
        </div>
        {status === 'loading' ? <Loading /> : (
          <div className='flex flex-wrap gap-6'>
            {users.map((user) => (
              <UserCard user={user} 
              key={user._id}/>
            ))}
          </div>
        )}
        {status !== 'loading' && users.length === 0 && (
          <p>No users found.</p>
        )}
      </div>
    </div>
  )
}

export default Discover