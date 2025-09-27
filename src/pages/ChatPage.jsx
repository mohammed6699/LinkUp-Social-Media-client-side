import React, { useState } from 'react';
import { dummyRecentMessagesData, dummyUserData } from '../assets/assets';
import { ArrowLeft, Send } from 'lucide-react';

function ChatPage({ selectedUser = dummyUserData }) {
  const [messages, setMessages] = useState(dummyRecentMessagesData);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          _id: Date.now().toString(),
          from_user_id: dummyUserData,
          to_user_id: selectedUser,
          text: input,
          message_type: 'text',
          media_url: '',
          createdAt: new Date().toISOString(),
          seen: false,
        },
      ]);
      setInput('');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 p-4 bg-white shadow'>
        <button className='p-2 rounded-full hover:bg-gray-100'>
          <ArrowLeft />
        </button>
        <img src={selectedUser.profile_picture} alt='' className='w-10 h-10 rounded-full shadow' />
        <div>
          <h2 className='font-semibold'>{selectedUser.full_name}</h2>
          <p className='text-sm text-gray-500'>@{selectedUser.username}</p>
        </div>
      </div>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.from_user_id._id === dummyUserData._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.from_user_id._id === dummyUserData._id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text || (msg.media_url ? 'Media' : '')}
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <div className='p-4 bg-white flex items-center gap-2 border-t'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 px-4 py-2 border rounded-full focus:outline-none'
        />
        <button
          onClick={handleSend}
          className='bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-2 flex items-center justify-center'
        >
          <Send className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
