/*
 * File Name    : PostList.tsx
 * Description  : 복수의 게시글 컴포넌트가 동적으로 추가되는 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created      getPostList 추가 : 로드시 get 요청
 * 2024.09.13    김민지      Modified     PostSection 동적 추가
 */

import { PostSection } from './PostSection';

export const PostList: React.FC<any> = ({ posts }) => {
  return (
    <div>
      {/* 각 게시글 데이터를 PostSection에 전달 */}
      {posts.map((post) => (
        <PostSection key={post.post_id} data={post} />
      ))}
    </div>
  );
};
