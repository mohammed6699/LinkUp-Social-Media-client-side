import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UserInfo from '../components/UserInfo';
import PostCard from '../components/PostCard';
import moment from 'moment';
import EditProfile from '../components/EditProfile';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchUserProfile } from '../features/discover/discover-slice';

function Profile() {
  const {profileId} = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Posts');
  const [showdata, setShowdata] = useState(false);
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { status } = useSelector(state => state.discover);

  useEffect(() => {
    const fetchUser = async() => {
      const token = await getToken();
      const result = await dispatch(fetchUserProfile({token, profileId})).unwrap();
      if (result) {
        setUser(result.user);
        setPosts(result.posts);
      }
    }
    fetchUser()
  }, [dispatch, getToken, profileId])

  return status === 'loading' ? <Loading /> : user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* proifle card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* cover photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
              {user.cover_photo && <img src={user.cover_photo}
              className='w-full h-full object-cover'
              alt='user cover photo'
              />}
          </div>
          {/* user info */}
          <UserInfo user={user} post={posts} profileId={profileId} setShowEdit={setShowdata}/>
        </div>
        {/* tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'> 
            {["Posts", "Media", "Likes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-2 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer 
                  ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* posts */}
          {activeTab === 'Posts' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.map((p) => (
                <PostCard key={p._id} post={p}/>
              ))}
            </div>
          )}
          {/* media */}
          {activeTab === 'Media' && (
            <div className='flex flex-wrap mt-6 max-w-6xl'>
              {posts.filter((p)=>p.image_urls.length > 0).map((post) => (
                <>
                  {post.image_urls.map((image, index) => (
                    <Link target='_blank' to={image} key={index} className='relative group'>
                      <img src={image} key={index} className='w-64 aspect-video object-cover' alt='user media'/>
                      <p 
                      className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0
                      group-hover:opacity-100 transition duration-300'
                      >posted {moment(post.createdAt).fromNow()}</p>
                    </Link>
                  ))}
                </>
              ))
              }
            </div>
          )}
        </div>
      </div>
  {/* edit profile modal */}
  {showdata && <EditProfile user={user} setShowEdit={setShowdata} />}
    </div>
  ) : (
    <p>User not found</p>
  )
}

export default Profile