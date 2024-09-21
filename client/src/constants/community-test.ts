export const testPostList = {
  totalItems: 50, // 전체 게시글 수
  currentPage: 1, // 현재 페이지
  totalPages: 5, // 총 페이지 수
  community: [
    { postId: 1, title: 'Post 1', content: 'Content 1', category: 'study', user: 'kim', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 2, title: 'Post 2', content: 'Content 2', category: 'interview', user: 'park', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 3, title: 'Post 3', content: 'Content 3', category: 'study', user: 'Lee', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 4, title: 'Post 4', content: 'Content 4', category: 'meeting', user: 'choi', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 5, title: 'Post 1', content: 'Content 1', category: 'study', user: 'kim', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 6, title: 'Post 2', content: 'Content 2', category: 'interview', user: 'park', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 7, title: 'Post 3', content: 'Content 3', category: 'talk', user: 'Lee', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 8, title: 'Post 4', content: 'Content 4', category: 'interview', user: 'choi', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 9, title: 'Post 1', content: 'Content 1', category: 'study', user: 'kim', createdAt: '2024-09-12T12:34:56.789Z' },
    { postId: 10, title: 'Post 2', content: 'Content 2', category: 'interview', user: 'park', createdAt: '2024-09-12T12:34:56.789Z' },
  ],
};

export const testPost = {
  postId: 5,
  title: '제목입니다울랄라',
  content: '내용입니다.',
  userId: '1004',
  category: 'study',
  createdAt: '2024-09-12T12:34:56.789Z',
  updated_at: '2024-09-12T12:34:56.789Z',
  // likes_count: 10,
  viewCount: 100,
  commentCount: 5,
};

export const testReply = {
  postId: 1,
  comments: [
    {
      commentId: 101,
      content: '부모 댓글 1',
      createdAt: '2024-09-12T12:00:00Z',
      updatedAt: '2024-09-12T12:05:00Z',
      repliesCount: 2, // 대댓글 수 추가
    },
    {
      commentId: 102,
      content: '부모 댓글 2',
      createdAt: '2024-09-12T12:06:00Z',
      updatedAt: '2024-09-12T12:07:00Z',
      repliesCount: 0, // 대댓글 수 추가
    },
  ],
};
