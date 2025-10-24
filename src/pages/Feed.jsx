import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../features/posts/post-slice';
import { fetchStories } from '../features/stories/story-slice';
import { fetchRecentMessages } from '../features/messages/message-slice';
import { useAuth } from '@clerk/clerk-react';

import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';

function Feed() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { posts, status: postStatus } = useSelector((state) => state.posts);
  const { stories, status: storyStatus } = useSelector((state) => state.stories);
  const { messages: recentMessages, status: messageStatus } = useSelector((state) => state.messages);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      dispatch(fetchPosts(token));
      dispatch(fetchStories(token));
      dispatch(fetchRecentMessages(token));
    };
    fetchData();
  }, [dispatch, getToken]);

  const loading = postStatus === 'loading' || storyStatus === 'loading' || messageStatus === 'loading';

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* stores and post list */}
      <div>
        <StoriesBar stories={stories || []} />
        <div className='p-4 space-y-4'>
          {(posts || []).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      {/* right side bar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xl text-xs bg-white p-4 rouded-md inline-flex flex-col shadow gap-2'>
          <h1 className='text-slate-500 font-semibold'>Sponsored</h1>
          <img src={assets.sponsored_img} alt='sponsore image' className='w-75 h-50 rounded-md' />
          <p className='text-gray-600'>Email Marketing</p>
          <p className='text-slate-400'>Superchange your marketing with a powerfull, easy-to-use platform built for results</p>
        </div>
        <RecentMessages messages={recentMessages || []} />
      </div>
    </div>
  ) : <Loading />;
}

export default Feed;