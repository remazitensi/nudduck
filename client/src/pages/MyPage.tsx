/**
 * File Name    : MyPage.tsx
 * Description  : pages - 마이페이지 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     마이 페이지 생성
 * 2024.09.10    김우현      updated     api 업데이트
 */
import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../apis/mypage-api';
import MyProfile from '../components/MyPage/MyProfile';
import QuitModal from './QuitModal';

export interface Post {
  postId: number;
  title: string;
  createdAt: string;
}

export interface LifeGraphEvent {
  age: number;
  score: number;
  title: string;
  description: string;
}
export interface FavoriteLifeGraph {
  id: number;
  currentAge: number;
  title: string;
  events: LifeGraphEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  imageUrl: string;
  nickname: string;
  name: string;
  email: string;
  createdAt: string;
  hashtags: string[];
  favoriteLifeGraph: FavoriteLifeGraph | null;
  posts: Post[];
}

const MyPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [limit] = useState(10); // 한 페이지당 보여줄 게시글 수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const [profile, setProfile] = useState({
    id: '',
    imageUrl: '/user_image.png',
    nickname: '',
    name: '',
    email: '',
    hashtags: [] as string[],
    createdAt: '',
    favoriteLifeGraph: null as FavoriteLifeGraph | null,
    posts: [] as Post[],
    totalCount: 0,
  });

  const fetchProfileData = async (page: number) => {
    setIsLoading(true);
    try {
      const userProfileData = await fetchUserProfile(page, limit);
      if (userProfileData) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...(userProfileData as unknown as Profile),
          totalCount: userProfileData.totalCount,
        }));
        setTotalPages(Math.ceil(userProfileData.totalCount / limit));
      }
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfileData(currentPage);
  }, [currentPage]);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleQuitOpenModal = () => {
    setQuitOpen(true);
  };

  const handleQuitCloseModal = () => {
    setQuitOpen(false);
  };

  const handleSaveImage = (newImage: string) => {
    setProfile((prevProfile) => ({ ...prevProfile, imageUrl: newImage }));
    handleCloseModal();
  };

  const handleSaveNickname = (newNickname: string) => {
    setProfile((prevProfile) => ({ ...prevProfile, nickname: newNickname }));
    handleCloseModal();
  };

  const handleSaveHashTag = (newHashTag: string[]) => {
    setProfile((prevProfile) => ({ ...prevProfile, hashtags: newHashTag }));
    handleCloseModal();
  };

  return (
    <div className='myPage-titles flex w-full flex-col items-center gap-[10px] bg-[#fcfcf8]'>
      <MyProfile
        open={open}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        handleSaveImage={handleSaveImage}
        handleSaveNickname={handleSaveNickname}
        handleSaveHashTag={handleSaveHashTag}
        userProfile={profile}
        currentPage={currentPage}
        limit={limit}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
        refetchProfile={fetchProfileData}
      />

      <div onClick={handleQuitOpenModal} className='mb-[50px] mt-[40px] flex w-[1200px] cursor-pointer justify-end gap-[5px]'>
        <img src='/quit.svg' alt='quit' />
        <div className='flex items-center text-[15px] text-[#8D8B67]'>탈퇴하기</div>
        {quitOpen && <QuitModal onClose={handleQuitCloseModal} />}
      </div>
    </div>
  );
};

export default MyPage;
