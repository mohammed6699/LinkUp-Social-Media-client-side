import { assets } from './../assets/assets';
import { Star } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';
function Login() {
  return (
    <>
      <div className='min-h-screen flex flex-col md:flex-row'>
        <img src={assets.bgImage} alt='background image' className='absolute top-0 left-0 -z-1 w-full h-full object-cover'/>
        {/* left side */}
        <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
          <img src={assets.logo} alt='logo image' className='h-12 object-contain'/>
            <div>
              <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
                  <img src={assets.group_users} alt='group users image' className='h-8 md:h-12'/>
                  <div>
                    <div className='flex'>
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className='size-4 md:size-6 text-transparent fill-amber-400'/>
                      ))}
                    </div>
                    <p>Trusted by 10,000+ users</p>
                  </div>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-4">
              LinkUp: Where connections turn into communities.</h1>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
                  Build meaningful relationships, discover like-minded people, and grow together in vibrant communities tailored just for you.
              </p>
            </div>
            <span className='md:h-12'></span>
        </div>
        {/* right side */}
        <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
          <SignIn />
        </div>
      </div>
    </>
  )
}

export default Login