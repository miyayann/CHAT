'use client'

import { ChangeEvent, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

const UploadFileForm = () => {
  const [path, setPath] = useState<string | undefined>();
  console.log(path);
  const router = useRouter()


  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得
    const user = await supabase.auth.getUser()
    console.log(user.data);
    const filePath = file.name// 画像の保存先のpathを指定
    const { error } = await supabase.storage
      .from('pictures')
      .upload(filePath, file);

    if (error) {
      console.error(error);
    }

    const { data: updateData, error: updateError } = await supabase
  .from('users')
  .update({ avatarurl: filePath })
  .eq('id', user.data.user?.id);

  if (updateError) {
    console.error(updateError);
  }


    if (updateData) {
      const { data } = await supabase
        .storage
        .from('pictures')
        .getPublicUrl(filePath);
      const imageUrl = data.publicUrl;
      setPath(imageUrl);
    }
      router.push("/main");
  };
  

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-3xl font-mono h-12 flex items-center'>アイコン画像の設定</h1>
      <div className='flex flex-1 justify-center items-center'>
        <input className='mb-3' type="file" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default UploadFileForm;

