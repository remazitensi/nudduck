//

export type postList = { category?: string; page?: number; sort?: string; search?: string };

export type postDetail = { category?: string; id: string };

export type PostData = {
  post_id: number;
  title: string;
  content: string;
  category: string;
  user_id: number;
  created_at: string;
};
