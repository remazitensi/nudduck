export const testPostList = {
  totalItems: 50, // 전체 게시글 수
  currentPage: 1, // 현재 페이지
  totalPages: 5, // 총 페이지 수
  community: [
    { post_id: 1, title: 'Post 1', content: 'Content 1', category: 'study', user_id: 'kim', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 2, title: 'Post 2', content: 'Content 2', category: 'interview', user_id: 'park', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 3, title: 'Post 3', content: 'Content 3', category: 'study', user_id: 'Lee', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 4, title: 'Post 4', content: 'Content 4', category: 'meeting', user_id: 'choi', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 5, title: 'Post 1', content: 'Content 1', category: 'study', user_id: 'kim', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 6, title: 'Post 2', content: 'Content 2', category: 'interview', user_id: 'park', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 7, title: 'Post 3', content: 'Content 3', category: 'talk', user_id: 'Lee', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 8, title: 'Post 4', content: 'Content 4', category: 'interview', user_id: 'choi', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 9, title: 'Post 1', content: 'Content 1', category: 'study', user_id: 'kim', created_at: '2024-09-12T12:34:56.789Z' },
    { post_id: 10, title: 'Post 2', content: 'Content 2', category: 'interview', user_id: 'park', created_at: '2024-09-12T12:34:56.789Z' },
  ],
};

export const testPost = {
  post_id: 5,
  title: '제목입니다울랄라',
  content: '내용입니다.',
  user_id: '1004',
  category: 'study',
  created_at: '2024-09-12T12:34:56.789Z',
  updated_at: '2024-09-12T12:34:56.789Z',
  likes_count: 10,
  views_count: 100,
  comments_count: 5,
};
