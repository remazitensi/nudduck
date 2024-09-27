/**
 * File Name    : MyProfile.tsx
 * Description  : 마이페이지 내 프로필, 작성게시글 포함
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김우현      Updated     api 완성()
 * 2024.09.23    김민지      Modified    작성 게시글 레이아웃
 */
import React from 'react';
import UserEditModal from '../../pages/UserEditModal';
import { CreateDetailGraph } from '../Graph/CreateDetailGraph';

interface Post {
  id: number;
  title: string;
  createdAt: string;
}

interface LifeGraphEvent {
  age: number;
  score: number;
  title: string;
  description: string;
}

interface FavoriteLifeGraph {
  id: number;
  currentAge: number;
  title: string;
  events: LifeGraphEvent[];
  createdAt: string;
  updatedAt: string;
}

interface Profile {
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

interface MyProfileProps {
  open: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleSaveImage: (newImage: string) => void;
  handleSaveNickname: (newNickname: string) => void;
  handleSaveHashTag: (newHashTag: string[]) => void;
  userProfile: Profile;
  currentPage: number;
  limit: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
}

const MyProfile: React.FC<MyProfileProps> = ({
  open,
  handleOpenModal,
  handleCloseModal,
  handleSaveImage,
  handleSaveNickname,
  handleSaveHashTag,
  userProfile,
  currentPage,
  limit,
  totalPages,
  setCurrentPage,
  isLoading,
}) => {
  const currentPosts = userProfile.posts;
  console.log(userProfile.favoriteLifeGraph);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={`px-2 py-1 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
          {i}
        </button>,
      );
    }

    return (
      <div className='pagination mt-4 flex justify-center gap-2'>
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className='bg-gray-300 px-2 py-1'>
          이전
        </button>
        {pageNumbers}
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className='bg-gray-300 px-2 py-1'>
          다음
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold'>마이페이지</div>
        <div className='mt-[10px] w-[170px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[80px] flex w-[1200px] gap-[30px]'>
        {/* 프로필 영역 */}
        <div className='flex h-[780px] w-[500px] flex-col rounded-[20px] bg-[#fafafa] shadow-lg'>
          <div className='pl-[40px] pt-[35px]'>
            <div className='flex gap-[20px]'>
              <div className='text-[25px]'>내 프로필</div>
              <img className='cursor-pointer' src='edit_button.svg' alt='editButton' onClick={handleOpenModal} />
            </div>
            {/* 프로필 수정 모달 */}
            {open && (
              <UserEditModal
                data={userProfile}
                onClose={handleCloseModal}
                currentImage={userProfile.imageUrl}
                onSaveImage={handleSaveImage}
                onSaveNickname={handleSaveNickname}
                onSaveHashTag={handleSaveHashTag}
              />
            )}
            <div className='mt-[25px]'>
              <p className='text-[16px]'>내 정보를 입력하고 커뮤니티에서 더 많은 유저와 소통해요!</p>
              <div className='mt-[20px] w-[415px] border-b border-[#585858]'></div>
            </div>
          </div>
          <div className='flex justify-center'>
            <img className='mt-[20px] h-[250px] w-[250px] rounded-[125px]' src={userProfile.imageUrl || '/default_image.png'} alt='userImg' />
          </div>

          <div className='mt-[60px] pl-[65px]'>
            <div className='flex flex-wrap gap-[10px]'>
              {userProfile.hashtags.map((hashtag, index) => (
                <div key={index} className='text-[20px] text-[#909700]'>
                  {hashtag}
                </div>
              ))}
            </div>

            <div className='flex gap-[30px] text-[18px]'>
              <div className='mt-[20px] leading-loose'>
                <div>이름</div>
                <div>이메일</div>
                <div>닉네임</div>
                <div>가입일</div>
              </div>
              <div className='mt-[20px] leading-loose'>
                <p>{userProfile.name}</p>
                <p>{userProfile.email}</p>
                <p>{userProfile.nickname}</p>
                <p>{userProfile.createdAt.split('T')[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 내가 쓴 게시글 영역 */}
        <div className='flex h-[780px] w-[670px] flex-col rounded-[20px] bg-[#fafafa] shadow-lg'>
          <div className='pl-[40px] pt-[35px]'>
            <div className='flex gap-[20px]'>
              <div className='text-[25px]'>내 게시글</div>
            </div>
            <div className='mt-[25px]'>
              <p className='text-[16px]'>댓글을 단 유저와 취준메이트가 되어보세요!</p>
              <div className='mt-[20px] w-[415px] border-b border-[#585858]'></div>
            </div>
            <div className='mt-[50px] h-[434px] w-[602px]'>
              <div className='flex'>
                <p className='ml-[45px]'>날짜</p>
                <p className='ml-[200px]'>제목</p>
              </div>

              {/* 로딩 중일 때 화면에 로딩 표시 */}
              {isLoading ? (
                <div className='mt-[50px] flex justify-center'>
                  <p>로딩 중...</p>
                </div>
              ) : (
                <div className='mt-[27px] flex flex-col gap-[15px]'>
                  {currentPosts.length === 0 ? (
                    <div className='flex justify-center'>
                      <p>게시글이 없습니다.</p>
                    </div>
                  ) : (
                    currentPosts.map((post: Post) => (
                      <div key={post.id} className='flex items-center'>
                        <div className='ml-[10px] flex w-[120px]'>
                          <p>{post.createdAt.split('T')[0]}</p>
                        </div>
                        <div className='ml-[20px] flex w-[250px] justify-center'>
                          <p>{post.title}</p>
                        </div>
                        <img className='ml-auto' src='/edit-btn.png' />
                        <img className='ml-[6px]' src='/delete-btn.png' />
                      </div>
                    ))
                  )}
                </div>
              )}
              <div className='mt-4 flex justify-center'>{renderPagination()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 인생그래프 영역 */}
      <div className='flex h-[780px] w-[1200px] flex-col rounded-[20px] bg-[#fafafa] shadow-lg'>
        <div className='p-[40px]'>
          <div className='text-[25px]'>나의 대표 인생그래프</div>
          <div className='mt-[25px] w-[415px] border-b border-[#585858]'></div>

          {userProfile.favoriteLifeGraph ? (
            <div className='grid place-items-center'>
              <div className='py-[20px] text-[20px]'>{userProfile.favoriteLifeGraph.title}</div>
              <CreateDetailGraph events={userProfile.favoriteLifeGraph.events}></CreateDetailGraph>
            </div>
          ) : (
            <div className='mt-[100px] flex justify-center'>
              <p className='mt-[40px] text-[20px] text-gray-500'>대표로 설정한 인생그래프가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
