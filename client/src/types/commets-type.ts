export type CreateCommentDto = {
  content: string;
  postId: number;
  commentId?: number;
  parentId?: number;
};
