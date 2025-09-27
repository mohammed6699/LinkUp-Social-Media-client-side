import React, { useState } from 'react';
import { dummyUserData } from '../assets/assets';
import { X } from 'lucide-react';

function EditProfile({ user = dummyUserData, setShowEdit }) {
  const [form, setForm] = useState({
    full_name: user.full_name,
    username: user.username,
    bio: user.bio,
    location: user.location,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the updated data to your backend
    setShowEdit(false);
  };

  return (
    <div className='fixed inset-0 z-120 bg-black/40 backdrop-blur flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative'>
        <button
          onClick={() => setShowEdit(false)}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-full bg-gray-100'
        >
          <X className='w-5 h-5' />
        </button>
        <h2 className='text-xl font-bold mb-4 text-gray-800'>Edit Profile</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Full Name</label>
            <input
              type='text'
              name='full_name'
              value={form.full_name}
              onChange={handleChange}
              className='w-full mt-1 p-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Username</label>
            <input
              type='text'
              name='username'
              value={form.username}
              onChange={handleChange}
              className='w-full mt-1 p-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Bio</label>
            <textarea
              name='bio'
              value={form.bio}
              onChange={handleChange}
              className='w-full mt-1 p-2 border rounded-md resize-none'
              rows={3}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Location</label>
            <input
              type='text'
              name='location'
              value={form.location}
              onChange={handleChange}
              className='w-full mt-1 p-2 border rounded-md'
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-md hover:from-indigo-600 hover:to-purple-700 transition'
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
