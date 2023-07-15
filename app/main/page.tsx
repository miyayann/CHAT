"use client"

import ChatApp from '@/components/ChatApp'
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import {useUserContext} from "../Context/Store"


const Page = () => {
  const router = useRouter()
  const user = useUserContext();

  console.log(user);

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login");
  };

  const handleSignIn = () => {
    router.push("/login");
  }
  return (
    <div>
      <div className='h-12 bg-green-400 flex items-center justify-between w-full'>
        <div className='flex justify-between items-center w-3/4 m-auto'>
            <h1 className='text-3xl'>CHAT APP</h1>
          <nav>
            {user ? (<button className='py-3 px-2 bg-indigo-500 rounded-md text-white hover:bg-indigo-700' onClick={handleSignOut}>ログアウト</button>) : (<button className='py-3 px-2 bg-indigo-500 rounded-md text-white hover:bg-indigo-700' onClick={handleSignIn}>ログインページへ</button>)}
          </nav>
        </div>
      </div>
      <main className=''>
      <ChatApp/>
      </main>
      <div>
      </div>
      </div>
  )
}

export default Page;