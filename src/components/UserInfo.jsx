import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import moment from 'moment'
    function UserInfo({user, post, profileId, setShowEdit}) {
  return (
    <div className='relative py-4 px-6 md:px-6 bg-white'>
        <div className='flex flex-col md:flex-row items-start gap-6'>
            <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full'>
                <img src={user.profile_picture}
                alt='user proflie picture'
                className='absolute rounded-full z-2'/>
            </div>
            <div className='w-full pt-16 md:pt-0 md:pl-36'>
                <div className='flex flex-col md:flex-row items-start justify-between'>
                    <div className=''>
                        <div className='flex items-center gap-3'>
                            <h1 
                                className='text-2xl font-bold text-gray-700'
                            >
                                {user.full_name}
                            </h1>
                            <Verified className='w-6 h-6 text-blue-500'/>
                        </div>
                        <p className='text-gray-300'>{user.username ? `@${user.username}` : 'user name is not available'}</p>
                    </div>
                    {/* edit button for spavific user */}
                    {!profileId && 
                        <button 
                        onClick={() => setShowEdit(true)}
                        className='flex items-center gap-2 border border-gray-200 px-3 hover:bg-gray-50 rounded-lg font-medium transition-all mt-4 md:mt-0 cursor-pointer'>
                            <PenBox className='w-4 h-4'/>
                            Edit    
                        </button>}
                </div>
                {/* user bio */}
                <p className='text-gray-700 font-medium text-sm mt-4'>{user.bio }</p>
                {/* user location and joining date */}
                <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4'>
                    <span className='flex gap-2 items-center text-gray-700'>
                        <MapPin className='w-6 h-6'/>
                        {user.location ? user.location : 'Add location'}
                    </span>
                    <span className='flex gap-2 items-center text-gray-700'>
                        <Calendar className='w-6 h-6'/>
                        Joined <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
                    </span>
                </div>
                    {/* number of users and commects */}
                <div className='flex items-center gap-6 mt-6 border-t pt-4 border-gray-200'>
                    <div>
                        <span className='sm:text-xl font-bold text-gray-900'>
                            {post.length}
                        </span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1'>posts</span>
                    </div>
                    <div>
                        <span className='sm:text-xl font-bold text-gray-900'>
                            {user.followers.length}
                        </span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1'>Follwers</span>
                    </div>
                    <div>
                        <span className='sm:text-xl font-bold text-gray-900'>
                            {user.following.length}
                        </span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1'>Following</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserInfo