import React, { useState } from 'react'
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { createPost } from '../features/posts/post-slice';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const userData = useSelector(state => state.user.value);
  const navigate = useNavigate();

  const handleSubmit = async() => {
    setLoading(true);
    const token = await getToken();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('post_type', images.length > 0 ? 'text_with_image' : 'text');
    images.forEach(image => {
        formData.append('images', image);
    });

    try {
        await dispatch(createPost({ token, postData: formData })).unwrap();
        setContent('');
        setImages([]);
        navigate('/');
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
          {/* title and description */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
            <p className='text-slate-600'>Share your thoghts with the World</p>
          </div>
          {/* user info and form */}
          <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-3'>
            <div className='flex items-center gap-3'>
              <img src={userData?.profile_picture} className='w-12 h-12 rounded-full shadow' alt='user profile image'/>
              <div className='mt-2'>
                <h2 className='font-semibold'>{userData?.full_name}</h2>
                <p className='text-sm text-gray-600'>@{userData?.username}</p>
              </div>
            </div>
            {/* text area */}
            <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400'
            placeholder="what's in your mind"
            onChange={(e) => setContent(e.target.value)}
            value={content}/>
            {/* images */}
              {
                images.length > 0 &&
                <div className='flex flex-wrap gap-2 mt-4'>
                    {images.map((image, index) => (
                      <div key={index}
                      className='relative group'>
                        <img src={URL.createObjectURL(image)} className='h-20 rounded-md' alt='choose your photo'/>
                        <div 
                        onClick={() => setImages(images.filter((_, i) =>index!== i))}
                        className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                            <X className='w-6 h-6 text-white'/>
                        </div>
                      </div>
                    ))}
                </div>
              }
              {/* button br */}
              <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
                <label htmlFor='images' 
                className='flex items-center gap-3 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
                  <Image className='w-6 h-6'/>
                  <input type='file' id='images' accept='image/*' hidden multiple
                  onChange={(e) => setImages([...images, ...e.target.files])}/>
                </label>

                {/* submit button */}
                <button 
                disabled={loading}
                onClick={() => toast.promise(handleSubmit(), {
                  loading: <p>Uploading...</p>,
                  success: <p>Post added succefully</p>,
                  error: <p>Error adding post</p>
                })}
                className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-700 hover:to-indigo-600 active:scale-95 transition text-white font-medium px-8 py-3 rounded-md cursor-pointer'>
                  publish post
                </button>
              </div>
          </div>
      </div>
    </div>
  )
}

export default CreatePost