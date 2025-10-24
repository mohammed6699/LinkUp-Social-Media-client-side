import { EyeIcon, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { fetchRecentMessages } from '../features/messages/message-slice'
import Loading from '../components/Loading'

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { messages, status } = useSelector((state) => state.messages);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      dispatch(fetchRecentMessages(token));
    };
    fetchData();
  }, [dispatch, getToken]);

  return status === 'loading' ? <Loading /> : (
    <div className='min-h-screen relative bg-slate-100'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-slate-800 mb-2'>Messages</h1>
            <p className='text-slate-500'>Talk to your friends and Family</p>
        </div>
        {/* connected users data */}
        <div className='flex flex-col gap-4'>
          {messages.map((message) => (
            <div key={message._id}
            className='max-w-xl flex felx-wrap items-center gap-5 p-6 bg-white shadow rouned-lg'>
              <img src={message.from_user_id.profile_picture}
              alt='user profile picture'
              className='rounded-full size-12 mx-auto'/>
              <div className='flex-1'>
                  <p className='font-medium text-slate-700'>{message.from_user_id.full_name}</p>
                  <p className='text-slate-500'>@{message.from_user_id.username}</p>
                  <p className='text-sm text-slate-500'>{message.test}</p>
              </div>
              {/* icons for chat and read */}
              <div className='flex flex-col gap-3 mt-4'>
                <button 
                onClick={() => navigate(`/messages/${message.from_user_id._id}`)}
                className='size-10 flex items-center justify-center text-sm rounded bg-slate-200 cursor-pointer'>
                  <MessageCircle className='w-4 h-4'/> 
                </button>
                <button 
                onClick={() => navigate(`/profile/${message.from_user_id._id}`)}
                className='size-10 flex items-center justify-center text-sm rounded bg-slate-200 cursor-pointer'>
                  <EyeIcon className='w-4 h-4'/> 
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Messages