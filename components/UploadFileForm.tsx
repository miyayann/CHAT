'use client'

import { ChangeEvent, useState } from 'react';
import { supabase } from '@/utils/supabase';

const UploadFileForm = () => {
  const [path, setPath] = useState<string | undefined>();
  console.log(path);


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


  };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {path && <img className="w-full h-full" src={path} alt="" />}
    </div>
  );
};

export default UploadFileForm;
