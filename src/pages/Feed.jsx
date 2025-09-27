import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from './../compoenets/Loading';
import StoriesBar from '../compoenets/StoriesBar';
import PostCard from '../compoenets/PostCard';
import RecentMessages from '../compoenets/RecentMessages';

function Feed() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false);
  }
  useEffect(() => {
    fetchFeeds();
  }, [])
  return !loading ? (

    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* stores and post list */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-4'>
          {feeds.map((post) => (
            <PostCard key={post._id} post={post}/>
          ))}
        </div>
      </div>
      {/* right side bar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xl text-xs bg-white p-4 rouded-md inline-flex flex-col shadow gap-2'>
          <h1 className='text-slate-500 font-semibold'>Sponsored</h1>
          <img src={assets.sponsored_img} alt='sponsore image' className='w-75 h-50 rounded-md'/>
          <p className='text-gray-600'>Email Marketing</p>
          <p className='text-slate-400'>Superchange your marketing with a powerfull, easy-to-use platform built for results</p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}

export default Feed