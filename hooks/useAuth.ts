
import { supabase } from '../utils/supabase';

const useAuth = () => {

  const onSignUp = async (email: string, password: string, name: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp(
        { email, password ,
        options: {
          data: {
            user_name: name,
        }},
      });
      if (signUpError) {
        throw signUpError;
      }
    } catch (error) {
      console.log(error);
      alert('正しい情報を入力してください');
    }
  };

  const onSignIn = async (email: string, password: string) => {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        throw signInError;
      }
      const userTableData = await supabase.from('users').select('*').eq('email', email);
      if (userTableData.error) {
        throw userTableData.error;
      }

    } catch (error) {
      console.error(error);
      alert('正しい情報を入力してください');
    }
  };

  const onAuthStateChange = (callback: (event: any, session: any) => void) => {
    const subscription = supabase.auth.onAuthStateChange(callback);
  
    const unsubscribe = () => {
      subscription?.data?.subscription?.unsubscribe();
    };
  
    return unsubscribe;
  };
  

  return {
    onSignUp,
    onAuthStateChange,
    onSignIn,
  };
};

export default useAuth;
