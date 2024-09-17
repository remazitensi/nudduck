/*
 * File Name    : PostList.tsx
 * Description  : 복수의 게시글 컴포넌트가 동적으로 추가되는 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created      getPostList 추가 : 로드시 get 요청
 */

import { useEffect, useState } from 'react';
import { getPostList } from '../../apis/community-api';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostList(
      (page = 1),
      (sort = 'latest'),
      (response) => {
        setPosts(response?.data);
        console.log(posts);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  return <div>{/* TODO : post 데이터를 받아가는 게시글 컴포넌트 */}</div>;
};
