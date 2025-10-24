import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUnreadMessageCount } from '../features/messages/message-slice';
import { useAuth } from '@clerk/clerk-react';

function UnreadMessagesCount() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { unreadCount } = useSelector((state) => state.messages);

  useEffect(() => {
    const fetchCount = async () => {
      const token = await getToken();
      dispatch(getUnreadMessageCount(token));
    };
    fetchCount();
  }, [dispatch, getToken]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {unreadCount}
    </span>
  );
}

export default UnreadMessagesCount;
