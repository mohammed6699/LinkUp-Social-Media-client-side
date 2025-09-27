import React from 'react'

function StoryViewer({viewStory, setViewStory}) {
  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-0'
      style={{backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : 'black'}}>
      {/* User info top left */}
      <div className='absolute top-6 left-8 flex items-center gap-3 z-120'>
        <img src={viewStory.user.profile_picture} alt='user profile' className='size-12 rounded-full ring ring-gray-200 shadow'/>
        <div>
          <h2 className='font-bold text-lg'>{viewStory.user.full_name}</h2>
          <p className='text-sm text-white/70'>@{viewStory.user.username}</p>
        </div>
      </div>
      {/* Close button top right */}
      <button onClick={() => setViewStory(null)} className='absolute top-6 right-8 text-white bg-black/40 rounded-full p-2 z-120'>
        ×
      </button>
      {/* Story content center */}
      <div className='w-full h-full flex items-center justify-center'>
        {viewStory.media_type === 'image' && viewStory.media_url ? (
          <div className='flex items-center justify-center w-full h-full' style={{backgroundColor: viewStory.background_color || '#6366f1'}}>
            <img src={viewStory.media_url} alt='story' className='max-h-[80vh] max-w-[80vw] object-contain rounded-lg'/>
          </div>
        ) : viewStory.media_type === 'video' && viewStory.media_url ? (
          <video src={viewStory.media_url} controls className='max-h-[80vh] max-w-[80vw] object-contain rounded-lg'/>
        ) : (
          <div className='flex flex-col items-center justify-center w-full h-full' style={{backgroundColor: viewStory.background_color || '#6366f1'}}>
            <p className='text-2xl font-semibold text-white text-center px-8'>{viewStory.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryViewer