import { BadgeCheck, Heart, MessageCircle, Share2, ShareIcon } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

function PostCard({post}) {
    const postWithHags = post.content.replace(/#(\w+)/g, '<span class="text-indigo-500 cursor-pointer">#$1</span>');
    const [likes, setLikes] = useState(post.likes_count);
    const currentUser = dummyUserData
    const handleLike = async () => {
        
    }
    const navigate = useNavigate()
  return (
    <div className='bg-white border-xl shadow p-4 mt-4 mb-4 w-full max-w-2xl'>
        {/* user info */}
        <div 
        onClick={() => navigate(`/profile/${post.user._id}`)}
        className='inline-flex items-center gap-3 cursor-pointer'>
            <img 
            src={post.user.profile_picture}
            alt='user profile picture'
            className='w-10 h-10 rounded-full shadow'
            />
            {/* user name and post date */}
            <div>
                <div className='flex items-center space-x-1'>
                    <span>
                        {post.user.full_name}
                        <BadgeCheck className='w-4 h-4 text-blue-500'/>
                    </span>
                </div>
                <div className='text-gray-500 text-sm'>
                    @{post.user.username} . {moment(post.createdAt) . fromNow()}
                </div>
            </div>
        </div>
        {/* content  */}
        {post.content && <div 
            className='text-gray-600 text-sm whitespace-pre-line p-2'
            // dangerouslySetInnerHTML => used when you need to show data includng tags styling, or structure
            dangerouslySetInnerHTML={{__html: postWithHags}}
        />}
        {/* Images */}
        <div className='grid grid-cols-2 gap-2'>
            {post.image_urls.map((image, index) => (
                <img src={image} key={index}
                alt='post images'
                className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}/>
            ))}
        </div>
        {/* action buttons */}
        <div className='flex items-center gap-4 text-gray-600 text-sm p-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart 
                onClick={handleLike}
                className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id)} && 'text-red fill-red-600`}/>
                <span>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle 
                onClick={handleLike}
                className='w-4 h-4 cursor-pointer'/>
                <span>{15}</span>
            </div>
             <div className='flex items-center gap-1'>
                <Share2  
                onClick={handleLike}
                className='w-4 h-4 cursor-pointer'/>
                <span>{8}</span>
            </div>
        </div>
    </div>
  )
}

export default PostCard