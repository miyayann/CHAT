'use client'

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { addSupabaseData } from "../hooks/useFunction";

const Form = () => {
  const [inputText, setInputText] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string| undefined>("");
  console.log(userName);
  console.log(userId);

  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const fetchUserInfo = async () => {
    try {
      const { data: session, error } = await supabase.auth.getUser();
      console.log(session.user?.id);
      setUserId(session.user?.id)
      if (error) {
        console.error(error);
        return;
      }
  
      if (session?.user?.user_metadata?.user_name) {
        const user_name = session.user.user_metadata.user_name;
        console.log(user_name);
        // ここで user_name を使って必要な処理を行います
        setUserName(user_name);
      } else {
        console.log("ユーザー名が存在しません");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchUserInfo();

  const onSubmitNewMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputText === "") return;

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");

      if(!userName) {
        alert("ログインしてください")
      }

    if (usersError) {
      console.error(usersError);
      return;
    }

    addSupabaseData({
      message: inputText,
      user_name: userName,
      user_id: userId,
    });

    setInputText("");
  };
  
  
  return (
    <div className="flex justify-center mb-24">
    <form onSubmit={onSubmitNewMessage} className=" w-full py-2 px-5 h-10">
      <input
        className="py-2 px-2 border h-12 rounded-md w-full mb-2 "
        name="message"
        value={inputText}
        onChange={onChangeInputText}
        placeholder="メッセージを入力してください"
        />
      <button className="rounded bg-indigo-600 px-3 py-3 text-sm font-medium text-white hover:bg-indigo-700" type="submit" disabled={inputText === ""}>
        送信
      </button>
    </form>
    </div>
  );
};

export default Form;
