import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets';
import { Plus } from 'lucide-react';
import StoryModel from './StoryModel';
import StoryViewer from './StoryViewer';

function StoriesBar() {
    const [stories, setStories] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [viewStory, setViewStory] = useState(null);

    const fetchStories = async () => {
        // fetch stories from api
        setStories(dummyStoriesData);
    }
    useEffect(() => {
        fetchStories();
    }, [])
  return (
    <div 
    className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'
    >
        <div className='flex gap-4 pb-5'>
            {/* Add story card */}
            <div
            onClick={() => setShowModel(true)}
            className='rounded-lg shadow-sm min-w-35 max-w-35 max-h-40 aspect-[3/4] cursor-pointer border-2 border-dashed border-black bg-slate-300'
            >
                <div className='h-full flex flex-col items-center justify-center p-4'>
                    <div className='size-10 bg-indigo-400 rounded-full flex items-center justify-center mb-3'>
                        <Plus className='w-5 h-5 text-white'/>
                    </div>
                    <p className='text-sm font-medium text-black text-center'>Create a story</p>
                </div>
            </div>
                {/* stories cards */}
                {stories.map((story, index) => {
                    const date = new Date(story.createdAt).toLocaleDateString();
                    return (
                        <div key={index}
                           onClick={() => setViewStory(story)}
                            className={`relative rounded-lg shadow-sm min-w-35 max-w-35 max-h-40 aspect-[3/4] cursor-pointer bg-gradient-to-b from-indigo-300 to-indigo-600 hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 active:scale-95 flex items-center justify-center overflow-hidden`}
                        >
                            {/* Story media (if any) */}
                            {story.media_type === 'image' && story.media_url && (
                                <img src={story.media_url} alt='story' className='object-cover w-full h-full rounded-lg'/>
                            )}
                            {story.media_type === 'video' && story.media_url && (
                                <video src={story.media_url} controls className='object-cover w-full h-full rounded-lg'/>
                            )}
                            {/* Overlay user info and content */}
                            <div className='absolute inset-0 flex flex-col justify-end items-start p-3 pointer-events-none'>
                                <img src={story.user.profile_picture} alt='user profile picture'
                                    className='size-8 mb-2 rounded-full ring ring-gray-100 shadow'/>
                                {story.content && (
                                    <p className='text-white/80 text-sm text-left truncate max-w-24 mb-1'>{story.content}</p>
                                )}
                                <p className='text-white text-xs'>{date}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
        {/* Add story model */}
        {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories}/>}
        {/* view story model */}
        {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  )
}

export default StoriesBar