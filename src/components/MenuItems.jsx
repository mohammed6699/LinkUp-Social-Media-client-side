import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';

import UnreadMessagesCount from './UnreadMessagesCount';

function MenuItems({setSideBar}) {
  const { user } = useUser();
  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium'>
    {
      menuItemsData.map(({ to, label, Icon }) => {
        const path = to === '/profile' ? `/profile/${user.id}` : to;
        return (
          <NavLink key={to} to={path} end={path === '/'} 
              onClick={() => setSideBar(false)}
              className={({isActive}) => `px-3.5 py-2 flex items-center justify-between rounded-xl
              ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
              >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5"/>
                {label}
              </div>
              {label === 'Messages' && <UnreadMessagesCount />}
          </NavLink>
        )
      })
    }
    </div>
  )
}



export default MenuItems