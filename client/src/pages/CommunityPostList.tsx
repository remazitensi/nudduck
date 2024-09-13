/**
 * File Name    : CommunityPostList.tsx
 * Description  : Community 페이지, 게시글 랜더 기능
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 페이지 생성
 * 2024.09.13    김민지      Modified    PostSection 동적 추가, 컴포넌트 분리, 카테고리 선택
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPostList } from '../apis/community-api';
import { PostList } from '../components/Community/PostList';
import { testPostList } from '../constants/community-test';

const CommunityPostList: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [posts, setPosts] = useState({ community: [] });

  const fetchPosts = async (category: string) => {
    const data = await getPostList({ category, page, sort }); //api get 실행
    setPosts(data); // 받아온 데이터로 state 업데이트
    console.log(posts);
    //NOTE: data.community가 아닌 data로 저장하는 이유 : 다른 변수를 페이지네이션에 사용해야 해서
  };
  // console.log(testPostList);

  // 페이지 로드시 테스트 데이터를 posts에 업데이트
  useEffect(() => {
    const testData = testPostList;
    setPosts(testData); // 테스트 데이터 업데이트
    console.log('useEffect executed, test data set');
  }, []);

  // posts 상태 변경 시 동작
  useEffect(() => {
    console.log('Posts state updated:', posts); // posts가 변경될 때마다 호출
  }, [posts]);

  return (
    <div className='community-titles flex flex-col items-center'>
      <div className='mt-[140px]'>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[8D8B67]'></div>
      </div>
      <div className='mt-[55px]'>
        <div className='flex items-center'>
          <div className='flex cursor-pointer gap-[80px] text-[20px]'>
            <div onClick={() => setCategory('')}>전체</div>
            <div onClick={() => setCategory('interview')}>면접</div>
            <div onClick={() => setCategory('meeting')}>모임</div>
            <div onClick={() => setCategory('study')}>스터디</div>
            <div onClick={() => setCategory('talk')}>잡답</div>
          </div>
          <div className='ml-[70px] flex items-center'>
            <div className='flex items-center gap-[20px]'>
              <input className='flex h-[50px] w-[300px] rounded-xl border p-[10px]' placeholder='제목/내용을 입력해주세요' />
              <button className='h-[50px] w-[80px] rounded-[10px] bg-[#909700] font-bold text-white'>검색</button>
            </div>
          </div>
        </div>
      </div>

      <div className='community-post mt-[60px]'>
        <div className='flex w-[700px] justify-between'>
          <div>
            <Link to='/CommunityWrite'>
              <button className='h-[46px] w-[180px] rounded-[10px] bg-[#909700] text-[20px] font-bold text-white'>게시글 작성</button>
            </Link>
          </div>
          <div className='flex items-center gap-[10px] text-[18px]'>
            <button className='text-[#59573D]'>최신순</button>
            <div className=''>|</div>
            <button className='text-[#AEAC9A]'>인기순</button>
            <div className=''>|</div>
            <button className='text-[#AEAC9A]'>조회순</button>
          </div>
        </div>

        <div className='w-[700px]'>
          <div className='mb-[30px] flex flex-col'>
            <div className='mt-[10px] w-full border-b-2 border-[8D8B67]'></div>
            <PostList posts={posts.community} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostList;
