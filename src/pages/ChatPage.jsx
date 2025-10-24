import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { getChatMessages, sendMessage, addMessage } from '../features/messages/message-slice';
import { fetchUserProfile } from '../features/discover/discover-slice';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL);

function ChatPage() {
  const { userId: otherUserId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken, userId: currentUserId } = useAuth();
  const { messages, status } = useSelector((state) => state.messages);
  const { value: currentUser } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.discover);
  const [input, setInput] = useState('');
  const [selectedUserLocal, setSelectedUserLocal] = useState(null);
  const messagesEndRef = useRef(null);

  // helper to support sender fields that may be either an object (populated) or a string id
  const getId = (maybeObj) => {
    if (!maybeObj) return null;
    return typeof maybeObj === 'string' ? maybeObj : maybeObj._id;
  };

  const selectedUser = users.find(user => user._id === otherUserId) || selectedUserLocal;

  useEffect(() => {
    const fetchMessages = async () => {
      const token = await getToken();
      dispatch(getChatMessages({ token, to_user_id: otherUserId }));
    };
    fetchMessages();
  }, [dispatch, getToken, otherUserId]);

  // If the discover.users list doesn't contain the chat user, fetch their profile once
  useEffect(() => {
    if (users.find(u => u._id === otherUserId) || selectedUserLocal) return;
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await dispatch(fetchUserProfile({ token, profileId: otherUserId }));
        // fetchUserProfile returns the API response (data) when successful
        if (res && res.payload) {
          // the backend returns data.user (adjust if your API uses a different shape)
          const loaded = res.payload.user || res.payload;
          if (loaded) setSelectedUserLocal(loaded);
        }
      } catch {
        // ignore; UI will keep showing loading or fallback
      }
    };
    fetchProfile();
  }, [users, selectedUserLocal, dispatch, getToken, otherUserId]);

  useEffect(() => {
    if (!currentUser) return;
    const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/api/message/${currentUser._id}`);
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      // support both populated object and id-string for from_user_id
      const fromId = getId(newMessage.from_user_id);
      if (fromId === otherUserId) {
        dispatch(addMessage(newMessage));
      }
    };
    return () => {
      eventSource.close();
    };
  }, [dispatch, currentUser, otherUserId]);

  useEffect(() => {
    if (!currentUser) return;

    socket.emit("join_chat", currentUser._id);

    socket.on("receive_message", (newMessage) => {
      const fromId = getId(newMessage.from_user_id);
      if (fromId === otherUserId) {
        dispatch(addMessage(newMessage));
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dispatch, currentUser, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const token = await getToken();
      const messageData = new FormData();
      messageData.append('to_user_id', otherUserId);
      messageData.append('test', input);
      // create an optimistic message object with a temporary id
      const tempId = `temp_${Date.now()}`;
      const optimisticMsg = {
        _id: tempId,
        test: input,
        from_user_id: currentUser?._id || currentUser,
        to_user_id: otherUserId,
        createdAt: new Date().toISOString()
      };
      // show it immediately
      dispatch(addMessage(optimisticMsg));
      setInput('');

      socket.emit("send_message", optimisticMsg);

      // send to server, then replace optimistic message with server response
      const result = await dispatch(sendMessage({ token, messageData }));
      if (result.payload) {
        // replace optimistic with real
        dispatch({ type: 'messages/replaceMessage', payload: { tempId, message: result.payload } });
      }
    }
  };

  if (!selectedUser) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 p-4 bg-white shadow'>
        <button className='p-2 rounded-full hover:bg-gray-100' onClick={() => navigate(-1)}>
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
        {status === 'loading' ? <Loading /> : messages.map((msg) => {
          const fromId = getId(msg.from_user_id);
          const isMine = fromId && currentUser && fromId === currentUserId._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                  isMine
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.test || (msg.media_url ? 'Media' : '')}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className='p-4 bg-white flex items-center gap-2 border-t'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
