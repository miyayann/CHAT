import { supabase } from "@/utils/supabase";
import {InsertProps, FetchResponse, InsertResponse, DeleteResponse, UpdateProps, UpdateResponse  } from "../type/type";

export const TABLE_NAME = "posts";

// データの全取得
export const fetchDatabase = async (): Promise<FetchResponse> => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("created_at", { ascending: false });
    return { data: data || [], error };
  } catch (error) {
    console.error(error);
    return { data: [], error };
  }
};

// データの追加
export const addSupabaseData = async ({ message, user_name, user_id }: InsertProps): Promise<InsertResponse> => {
  try {
    const { error } = await supabase.from(TABLE_NAME).insert([{ message, user_name, user_id}]);
    return { error,message, user_name, user_id};
  } catch (error) {
    console.error(error);
    return { error,message, user_name, user_id };
  }
};

// データの削除
export const deleteSupabaseData = async (id: number): Promise<DeleteResponse > => {
  try {
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
    return { error };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

// データの更新
export const updateSupabaseData = async ({ id, message }: UpdateProps): Promise<UpdateResponse> => {
  try {
    const { error } = await supabase.from(TABLE_NAME).update({ message }).eq('id', id);
    return { error, message };
  } catch (error) {
    console.error(error);
    return { error };
  }
};