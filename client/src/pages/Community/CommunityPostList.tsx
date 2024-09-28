/**
 * File Name    : CommunityPostList.tsx
 * Description  : Community 페이지, 게시글 랜더 기능
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 페이지 생성
 * 2024.09.13    김민지      Modified    PostSection 동적 추가, 컴포넌트 분리, 카테고리 선택
 * 2024.09.14    김민지      Modified    글쓰기 Link 수정
 * 2024.09.19    김민지      Modified    sort, category switch 추가
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPostList } from '../../apis/community/community-post-api';
import { PostList } from '../../components/Community/PostList';
import { Post, PostListParams } from '../../types/community-type';

const CommunityPostList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]); // 게시글 리스트
  const [totalPostCount, setTotalPostCount] = useState<number>(1); // 전체 게시글 수
  const [pages, setPages] = useState<{ currentPage: number; totalPage: number }>({ currentPage: 1, totalPage: 1 });
  const [sort, setSort] = useState<string>('createdAt:desc');

  // const [sort, setSort] = useState('createdAt:desc'); // 최신순, 조회순 관리
  const [selectedCategory, setSelectedCategory] = useState(''); // 카테고리 상태

  // 카테고리에 따라 적절한 fetch 함수 호출
  const fetchPosts = async () => {
    const params: PostListParams = { page: pages.currentPage, sort, category: selectedCategory };
    console.log(params);
    const data = await getPostList(params);
    setPosts(data[0]);
    setTotalPostCount(data[1]);
  };

  // totalPostCount가 변경되면 totalPage 재계산
  useEffect(() => {
    setPages((pages) => ({
      ...pages,
      totalPage: Math.ceil(totalPostCount / 10), // 페이지당 10개 게시물
    }));
  }, [totalPostCount]);

  // 페이지 로드 시 및 sort,selectedCategory 변경 시 fetchPosts 호출
  useEffect(() => {
    fetchPosts();
    console.log('useEffect save posts :', posts);
  }, [selectedCategory, pages.currentPage, sort]);

  // 페이지네이션 현재 페이지 설정
  const handleCurrentPage = (newCurrentPage: number) => {
    setPages((pages) => ({ ...pages, currentPage: newCurrentPage })); // posts의 currentPage 상태 업데이트
  };

  // 카테고리 선택
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    resetCurrentPage();
  };

  // 정렬 선택
  const handleSortChange = (sort: string) => {
    setSort(sort);
    resetCurrentPage();
  };

  // 현재 페이지 1페이지로 리셋
  const resetCurrentPage = () => {
    setPages((pages) => ({ ...pages, currentPage: 1 }));
  };

  return (
    <div className='community-titles flex flex-col items-center'>
      <div className='mt-[140px] cursor-pointer' onClick={() => navigate('/community')}>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>
      <div className='mt-[55px]'>
        <div className='flex items-center'>
          <div className='flex cursor-pointer gap-[80px] text-[20px]'>
            <div onClick={() => handleCategoryChange('')} className={`text-[${selectedCategory === '' ? '#59573D' : '#AEAC9A'}]`}>
              전체
            </div>
            <div onClick={() => handleCategoryChange('interview')} className={`text-[${selectedCategory === 'interview' ? '#59573D' : '#AEAC9A'}]`}>
              면접
            </div>
            <div onClick={() => handleCategoryChange('meeting')} className={`text-[${selectedCategory === 'meeting' ? '#59573D' : '#AEAC9A'}]`}>
              모임
            </div>
            <div onClick={() => handleCategoryChange('study')} className={`text-[${selectedCategory === 'study' ? '#59573D' : '#AEAC9A'}]`}>
              스터디
            </div>
            <div onClick={() => handleCategoryChange('talk')} className={`text-[${selectedCategory === 'talk' ? '#59573D' : '#AEAC9A'}]`}>
              잡담
            </div>
          </div>
          {/* 검색 컴포넌트 삭제 */}
          {/* <div className='ml-[70px] flex items-center'>
            <div className='flex items-center gap-[20px]'>
              <input
                className='flex h-[50px] w-[300px] rounded-xl border p-[10px]'
                placeholder='제목/내용을 입력해주세요'
                value={inputValue} // input 상태 값 반영
                onChange={(e) => setInputValue(e.target.value)} // input 값 변경 시 상태 업데이트
              />
              <button className='h-[50px] w-[80px] rounded-[10px] bg-[#909700] font-bold text-white' onClick={fetchPosts}>
                검색
              </button>
            </div>
          </div> */}
        </div>
      </div>

      <div className='community-post mt-[60px]'>
        <div className='flex w-[900px] justify-between'>
          <div>
            <Link to='/community/create'>
              <button className='h-[46px] w-[180px] rounded-[10px] bg-[#909700] text-[20px] font-bold text-white'>게시글 작성</button>
            </Link>
          </div>
          <div className='flex items-center gap-[10px] text-[18px]'>
            <button
              className={`text-[${sort === 'createdAt:desc' ? '#59573D' : '#AEAC9A'}]`}
              onClick={() => {
                handleSortChange('createdAt:desc');
              }}
            >
              최신순
            </button>
            <div>|</div>
            {/* 인기순 삭제 */}
            {/* <button
              className={`text-[${sort === 'popular' ? '#59573D' : '#AEAC9A'}]`}
              onClick={() => {
                // console.log('Sort changed to popular');
                setSort('popular');
              }}
            >
              인기순
            </button>
            <div>|</div> */}
            <button
              className={`text-[${sort === 'viewCount:desc' ? '#59573D' : '#AEAC9A'}]`}
              onClick={() => {
                handleSortChange('viewCount:desc');
              }}
            >
              조회순
            </button>
          </div>
        </div>

        <div className='w-[900px]'>
          <div className='mb-[30px] flex flex-col'>
            <div className='mt-[10px] w-full border-b-2 border-[8D8B67]'></div>
            {/* 게시물 목록 컴포넌트 */}
            <PostList posts={posts} />

            {/* 페이지네이션 컴포넌트 */}
            <div className='pagination-controls mt-10 flex flex-col items-center'>
              <div className='flex space-x-2'>
                <button onClick={() => handleCurrentPage(pages.currentPage - 1)} disabled={pages.currentPage === 1}>
                  이전
                </button>
                {Array.from({ length: pages.totalPage }, (_, index) => (
                  <button key={index + 1} onClick={() => handleCurrentPage(index + 1)} disabled={index + 1 === pages.currentPage} className={`${index + 1 === pages.currentPage ? 'font-bold' : ''}`}>
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => handleCurrentPage(pages.currentPage + 1)} disabled={pages.currentPage === pages.totalPage}>
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostList;
