"use client"
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';


import useAuth from '../../hooks/useAuth';

interface SignUpFormInput {
  name: string;
  email: string;
  password: string;
}

const SignUp: NextPage = () => {
  const router = useRouter();
  const { onSignUp } = useAuth();
  const { register, handleSubmit } = useForm<SignUpFormInput>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    try {
      const { name, email, password} = data;
      await onSignUp(email, password, name);

      router.push("/login");
    } catch(error) {
      console.log(error);
    };
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <h1 className='text-3xl pb-5'>登録画面</h1>
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>
      <label>
        <input type="name" placeholder="名前"  className='px-3 py-2 border-gray-200 border focus:border-indigo-300 focus:border placeholder-blue-300 rounded-lg mb-3' {...register('name', { required: true })} />
      </label>
      <label>
        <input type="email" placeholder="メールアドレス" className='px-3 py-2 border-gray-200 border focus:border-indigo-300 focus:border placeholder-blue-300 rounded-lg mb-3' {...register('email', { required: true })} />
      </label>
      <label>
        <input type="password" placeholder="パスワード" className='px-3 py-2 border-gray-200 border focus:border-indigo-300 focus:border placeholder-blue-300 rounded-lg mb-3' {...register('password', { required: true })} />
      </label>
      <button className='py-2 px-4 mb-3 bg-indigo-500 rounded-lg text-white w-full hover:bg-indigo-700' type="submit">登録</button>
      <button className='py-2 px-4 bg-indigo-500 rounded-lg text-white w-full hover:bg-indigo-700' onClick={() => router.push('/login')}>ログイン画面へ</button>
    </form>
    </div>
  );
};

export  default SignUp;
