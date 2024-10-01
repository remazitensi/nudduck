export type CreateCommentDto = {
  content: string;
  postId: number;
  commentId?: number;
  parentId?: number;
};

export type CommentsDto = {
  postId: number;
  commentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  parentId?: number;
  userId: number;
  nickname: string;
  imageUrl: string;
};

export type RepliesResDto = {
  replies: CommentsDto[];
  total: number;
};

export type CommentsResDto = {
  replies: CommentsDto[];
  total: number;
};

export type UserInfo = {
  id: number;
  nickname: string;
  email: string;
  imageUrl: string;
  name: string;
};

export type UpdateCommentDto = {
  content: string;
  postId: number;
  commentId: number;
  parentId?: number;
};
