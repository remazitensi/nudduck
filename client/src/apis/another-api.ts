/*
 * File Name    : another-api.ts
 * Description  : 아직 개발되지 않은 기능의 api를 모아둔 곳
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created     get을 제외한 community-api 모음
 */

// 게시글 작성 post 요청
export async function writePost({ post }: { post: PostData }) {
  const navigate = useNavigate();
  try {
    // baseApi(url, { 백으로 보내야 할 정보를 담는 곳 })
    const response = await baseApi.post(api.community, { post });

    if (response.status === 201) {
      // 새로 작성한 게시물 페이지로 이동
      navigate(`/community/${post.post_id}`);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 게시글 수정 put 요청
export async function editPost({ post }: { post: PostData }) {
  const navigate = useNavigate();
  try {
    const response = await baseApi.put(`${api.community}/${post.post_id}`, {});

    if (response.status === 201) {
      // 수정한 게시글 페이지로 이동
      navigate(`/community/${post.post_id}`);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 게시글 삭제 delete 요청
export async function deletePost({ post }: { post: PostData }) {
  const navigate = useNavigate();
  try {
    const response = await baseApi.delete(`${api.community}/${post.post_id}`, {});

    if (response.status === 201) {
      //마이페이지로 리다이렉션 or 작성게시글get요청
      navigate(api.myPage);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}
