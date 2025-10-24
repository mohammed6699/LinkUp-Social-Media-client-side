import { Link } from 'react-router-dom';
import moment from 'moment';

function RecentMessages({ messages }) {
  return (
    <div className='bg-white max-w-xl mt-4 p-4 min-h-20 rounded-md shadow text-slate-500 text-sm'>
        <h1 className='text-slate-500 font-semibold mb-4'>Recent Messages</h1>
        <div className='flex flex-col max-h-65 overflow-y-scroll no-scrollbar'>
            {messages.map((message, index) => (
                <Link
                to={`/messages/${message.from_user_id._id}`}
                key={index}
                className='flex items-center gap-2 py-2 hover:bg-gray-200'
                >
                    <img 
                    src={message.from_user_id.profile_picture}
                    alt='user recent messages'
                    className='w-8 h-8 rounded-full'
                    />
                    <div className='flex flex-col w-full'>
                        <div className='flex justify-between'>
                            <p className='text-slate-400'>{message.from_user_id.full_name}</p>
                            <p className='text-[10px] text-slate-400'>{moment(message.createdAt).fromNow()}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='text-slate-500 truncate max-w-[120px]'>{message.text ? message.text: 'media'}</p>
                            {!message.seen && <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] ml-2'>1</p>}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default RecentMessages