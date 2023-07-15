"// use client"

import { supabase } from "@/utils/supabase";
import { TABLE_NAME, deleteSupabaseData, fetchDatabase} from "../hooks/useFunction"
import { useEffect, useState } from "react";
import { Database } from "../type/type";
import { format } from 'date-fns';
import Form from "./Form";
import  Link from "next/link";
import {useUserContext} from "../app/Context/Store"


  const ChatApp = () => {
    const [messageText, setMessageText] = useState<Database[]>([]);
    const [userId, setUserId] = useState<string | undefined>();
    console.log(messageText);
    console.log(userId);
    const user = useUserContext();

    console.log(user);

  // ユーザーごとのアバター画像URLを取得
  const fetchUserAvatarUrl = async (user_id: string) => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('avatarurl')
      .eq('id', user_id)
      .single();
    if (userError) {
      console.error(userError);
      return '';
    }
    const avatarUrl = userData ? userData.avatarurl : '';
    return avatarUrl;
  };

  // メッセージデータの取得と画像パスの関連付け
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('created_at', { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      const updatedMessages = await Promise.all(
        data.map(async (message) => {
          const avatarUrl = await fetchUserAvatarUrl(message.user_id);
          return { ...message, avatarUrl };
        })
      );
      setMessageText(updatedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUserId(user);
    fetchMessages();
    fetchRealtimeData();
  }, [user]);

    // リアルタイムデータ更新
    const fetchRealtimeData = () => {
      try {
        supabase
          .channel("table_postgres_changes") // 任意のチャンネル名
          .on(
            "postgres_changes", // ここは固定
            {
              event: "*", // "INSERT" | "DELETE" | "UPDATE"  条件指定が可能
              schema: "public",
              table: TABLE_NAME, // DBのテーブル名
            },
            async (payload) => {
              // データ登録
              if (payload.eventType === "INSERT") {
                console.log('payload: ', payload)
                const { id, message, user_name, user_id, created_at } = payload.new;
    
                // ユーザーテーブルからユーザーの画像URLを取得
                const avatarUrl = await fetchUserAvatarUrl(user_id);
                console.log(avatarUrl);
                setMessageText((messageText) => { 
                  const updatedText = [
                    ...messageText,
                    { id, message, user_name, user_id, created_at, avatarUrl } as Database
                  ];
                  return sortData(updatedText);
                });

                
              } 
              else if (payload.eventType === "DELETE") {
                const deletedId = payload.old.id;
                console.log(deletedId)
                setMessageText((messageText) =>
                  messageText.filter((item) => item.id !== deletedId)
                );
              }
            }
          )
          .subscribe();
    
        // リスナーの解除
        return () => supabase.channel("table_postgres_changes").unsubscribe();
      } catch (error) {
        console.error(error);
      }
    };
    
    // データを作成日時の降順でソートする関数
const sortData = (data: Database[]): Database[] => {
  return data.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

      // 初回のみ全データフェッチとリアルタイムリスナー登録
  useEffect(() => {
    (async () => {
      const allMessage = await fetchDatabase();
      if (allMessage.data !== null) {
        const sortedData = sortData(allMessage.data);
        setMessageText(sortedData);
      }
    })();
    fetchRealtimeData();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await deleteSupabaseData(id);
    if (error) {
      console.log(error);
    } 
  };
  

  return(
    <div className="flex flex-col items-center justify-center mt-2 w-full">
      <div className=" flex flex-col w-3/4">
      <Form />
    {messageText.map((item) => (
      <div className="flex w-full border rounded-md m-auto py-3 px-6 mb-6" key={item.id} data-user-id={item.user_name}>
        <div className="w-24 h-24 object-cover rounded-full overflow-hidden">
        <Link href="/UploadFileForm">
            {item.avatarUrl ? (
              <img src={`https://dheqdgxfochmuyhkgnur.supabase.co/storage/v1/object/public/pictures/${item.avatarUrl}`} className="rounded-full w-24 h-24" alt="Avatar" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300" />
            )}
          </Link>

        </div>
        <div className="flex justify-center items-center mx-2">
          <div>
        <p className="text-3xl">{item.user_name}</p>
          {item.created_at && (
            <p>{format(new Date(item.created_at), "MM/dd HH:mm:ss")}</p>
            )}
          {item.user_name === user && (
            <button onClick={() => handleDelete(item.id)}>削除</button>
            )}
            </div>
        </div>
        <div className="flex justify-center items-center">
          <p>{item.message}</p>
        </div>
      </div>
    ))}
    </div>
  </div>
  )
  }


  export default ChatApp;