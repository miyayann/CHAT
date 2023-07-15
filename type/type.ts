
// Postの型定義
export interface ChatPost {
  id: number;
  user_id: string | undefined;
  message: string;
  created_at: Date;
  user_name: string;
}

export type InsertProps = {
  message: string;
  user_name: string;
  user_id: string | undefined;
};

// データの取得時のレスポンス型定義
export interface FetchResponse {
  data: Database[] | null;
  error: any;
}

export type InsertResponse = {
  error: any;
  message: string;
  user_name: string;
  user_id: string | undefined;
};

export type Database = {
  id: number;
  user_id: string ;
  created_at: Date;
  message: string;
  user_name: string;
  avatarUrl: string;
};

export interface DeleteResponse {
  error: any;
}

export interface UpdateProps {
  id: number;
  message: string;
}

export interface UpdateResponse {
  error: any;
  message?: string;
}