'use client'

import { supabase } from "@/utils/supabase";
import { createContext, useContext, useEffect, useState, ReactNode} from "react";

// UserContext の名前空間を作成
const UserContext = createContext<string>("");

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  console.log(user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: session, error } = await supabase.auth.getUser();
        console.log(session?.user?.user_metadata.user_name)
        const user_name = session?.user?.user_metadata.user_name
        if (error) {
          console.error(error);
          return;
        }

        setUser(user_name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);


  return (
    <UserContext.Provider value={ user }>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext<string>(UserContext);
