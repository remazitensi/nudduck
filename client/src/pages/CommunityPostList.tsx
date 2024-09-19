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
 * 2024.09.19    김민지      Modified    sort, search 추가
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInterviewPostList, getMeetingPostList, getPostList, getStudyPostList, getTalkPostList } from '../apis/community-api';
import { PostList } from '../components/Community/PostList';
import { PostListParams, PostListRes } from '../types/community-type';

const CommunityPostList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostListRes>({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    community: [],
  });

  const [inputValue, setInputValue] = useState(''); // input의 값을 관리
  const [search, setSearch] = useState(''); // 검색 상태
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null); // debounce 타이머
  const [sort, setSort] = useState('latest'); // 최신순, 인기순, 조회순 관리
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 카테고리 상태

  // 카테고리에 따라 적절한 fetch 함수 호출
  const fetchPosts = async () => {
    const params: PostListParams = { page: posts.currentPage, sort: sort, search: search };
    let data;

    switch (selectedCategory) {
      case '면접':
        data = await getInterviewPostList(params);
        break;
      case '모임':
        data = await getMeetingPostList(params);
        break;
      case '스터디':
        data = await getStudyPostList(params);
        break;
      case '잡담':
        data = await getTalkPostList(params);
        break;
      default:
        // data = testPostList; // 전체 카테고리 게시물은 테스트 데이터 사용
        data = await getPostList(params);
    }

    setPosts(data);
  };

  // inputValue가 변경될 때마다 0.5초 뒤에 search 상태 업데이트
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // 이전 타이머 제거
    }

    const timeout = setTimeout(() => {
      setSearch(inputValue); // 입력된 값으로 search 상태 업데이트
    }, 500);

    setDebounceTimeout(timeout);

    // inputValue 변경 시 타이머 정리
    return () => clearTimeout(timeout);
  }, [inputValue]);

  // 페이지 로드 시 및 sort, search, selectedCategory 변경 시 fetchPosts 호출
  useEffect(() => {
    // console.log('Fetching posts with sort:', sort);
    fetchPosts();
  }, [sort, search, selectedCategory]);

  // 페이지가 처음 로드될 때 fetchPosts 실행
  useEffect(() => {
    fetchPosts();
  }, []);

  // 페이지네이션 현재 페이지 설정
  const handleCurrentPage = (newCurrentPage: number) => {
    setPosts((posts) => ({ ...posts, currentPage: newCurrentPage })); // posts의 currentPage 상태 업데이트
  };

  // 카테고리 선택 후 페이지 리셋
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPosts((posts) => ({ ...posts, currentPage: 1 }));
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
            <div onClick={() => handleCategoryChange('전체')}>전체</div>
            <div onClick={() => handleCategoryChange('면접')}>면접</div>
            <div onClick={() => handleCategoryChange('모임')}>모임</div>
            <div onClick={() => handleCategoryChange('스터디')}>스터디</div>
            <div onClick={() => handleCategoryChange('잡담')}>잡담</div>
          </div>
          <div className='ml-[70px] flex items-center'>
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
          </div>
        </div>
      </div>

      <div className='community-post mt-[60px]'>
        <div className='flex w-[700px] justify-between'>
          <div>
            <Link to='/community/create'>
              <button className='h-[46px] w-[180px] rounded-[10px] bg-[#909700] text-[20px] font-bold text-white'>게시글 작성</button>
            </Link>
          </div>
          <div className='flex items-center gap-[10px] text-[18px]'>
            <button
              className={`text-[${sort === 'latest' ? '#59573D' : '#AEAC9A'}]`}
              onClick={() => {
                // console.log('Sort changed to latest');
                setSort('latest');
              }}
            >
              최신순
            </button>
            <div>|</div>
            <button
              className={`text-[${sort === 'popular' ? '#59573D' : '#AEAC9A'}]`}
              onClick={() => {
                // console.log('Sort changed to popular');
                setSort('popular');
              }}
            >
              인기순
            </button>
            <div>|</div>
            <button
              className={`text-[${sort === 'views' ? '#59573D' : '#AEAC9A'}]`}
              onClick={() => {
                // console.log('Sort changed to views');
                setSort('views');
              }}
            >
              조회순
            </button>
          </div>
        </div>

        <div className='w-[700px]'>
          <div className='mb-[30px] flex flex-col'>
            <div className='mt-[10px] w-full border-b-2 border-[8D8B67]'></div>
            <PostList posts={posts.community} />

            {/* 페이지네이션 컴포넌트 */}
            <div className='pagination-controls mt-4 flex flex-col items-center'>
              <div className='flex space-x-2'>
                <button onClick={() => handleCurrentPage(posts.currentPage - 1)} disabled={posts.currentPage === 1}>
                  이전
                </button>
                {Array.from({ length: posts.totalPages }, (_, index) => (
                  <button key={index + 1} onClick={() => handleCurrentPage(index + 1)} disabled={index + 1 === posts.currentPage} className={`${index + 1 === posts.currentPage ? 'font-bold' : ''}`}>
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => handleCurrentPage(posts.currentPage + 1)} disabled={posts.currentPage === posts.totalPages}>
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
