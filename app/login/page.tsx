'use client'

import useAuth from "@/hooks/useAuth";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";


interface SignInFormInput {
  email: string;
  password: string;
 }

const SignIn: NextPage = () => {
const   {onSignIn, onAuthStateChange} = useAuth();
const router = useRouter();
const { register, handleSubmit } = useForm<SignInFormInput>({
  defaultValues: {
    email: '',
    password: '',
  },
});


const onSubmit: SubmitHandler<SignInFormInput> = async (data: { email: string; password: string; }) => {
  const { email, password } = data;
  await onSignIn(email, password);

  router.push("/main"); 
};

useEffect(() => {
  const handleAuthStateChange = (_event: any, session: any) => {
    console.log(session)
    // 認証状態が変更されたときに実行される処理をここに記述する
    if (session) {
      // ログイン済みの場合の処理
      router.push("/main");
    } else {
      // ログアウト済みの場合の処理
      router.push("/login"); 
    }
  };

  const unsubscribe = onAuthStateChange(handleAuthStateChange);
  console.log(unsubscribe);

  return () => {
    unsubscribe();
  };
}, []);

return (
  <div className='flex flex-col min-h-screen justify-center items-center'>
    <h1 className='text-3xl pb-5'>ログイン</h1>
  <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>
    <label>
    <input type="email" placeholder="メールアドレス" className='px-3 py-2 border-gray-200 border focus:border-indigo-300 focus:border placeholder-blue-300 rounded-lg mb-3' {...register('email', { required: true })} />
    </label>
    <label>
    <input type="password" placeholder="パスワード" className='px-3 py-2 border-gray-200 border focus:border-indigo-300 focus:border placeholder-blue-300 rounded-lg mb-3' {...register('password', { required: true })} />
    </label>
      <button className='py-2 px-4 bg-indigo-500 rounded-lg text-white w-full hover:bg-indigo-700 mb-3' type="submit">ログイン</button>
      <button className='py-2 px-4 bg-indigo-500 rounded-lg text-white w-full hover:bg-indigo-700' onClick={() => router.push('/')}>登録画面へ</button>
  </form>
  </div>
)
 }

 export default SignIn;