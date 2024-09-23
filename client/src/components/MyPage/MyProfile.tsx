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
import UserEditModal from '../../pages/UserEditModal';

import React, { useEffect, useState } from 'react';

import { fetchUserProfile } from '../../apis/mypage-api';

// MyProfile 컴포넌트에 필요한 props 타입 정의
interface MyProfileProps {
  open: boolean;
  // image: string;
  // nickName: string;
  // // hashTag: string; api 사용으로 인하여 더이상 필요없음
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleSaveImage: (newImage: string) => void;
  handleSaveNickName: (newNickName: string) => void;
  handleSaveHashTag: (newHashTag: string[]) => void;
  profile: {
    id: string;
    imageUrl: string;
    nickName: string;
    name: string;
    email: string;
    hashtags: string[];
    created_At: string;
  };
}

const MyProfile: React.FC<MyProfileProps> = ({
  open,
  // image,
  // nickName,
  // hashTag, 여기도 api 사용으로 인해서 prop이 아닌 api로 연결
  handleOpenModal,
  handleCloseModal,
  handleSaveImage,
  handleSaveNickName,
  handleSaveHashTag,
}) => {
  // // api 작업
  const [profile, setProfile] = useState({
    id: '',
    imageUrl: '',
    nickName: '',
    name: '',
    email: '',
    hashtags: [],
    created_At: '',
  }); // get으로 받아온 새 정보

  const [posts, setPosts] = useState([]); // 게시글 목록 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const fetchProfile = async () => {
    try {
      const data: typeof profile = await fetchUserProfile(); // profile 타입과 동일하게 설정
      setProfile(data);
      console.log('Fetched profile:', data); // API 호출 후 데이터 로그 확인
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  // api 작업
  useEffect(() => {
    // const updateProfile = async() => {
    // const data = await fetchProfile();
    // }
    // fetchProfile();
  }, []);

  // profile 상태가 업데이트되었을 때 로그를 출력하기 위한 useEffect
  useEffect(() => {
    console.log('Updated profile:', profile);
  }, [profile]);

  // ----------- api 끝 -----------

  // 페이지네이션 현재 페이지 설정
  const handleCurrentPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // page에 현재 페이지 저장
    }
  };

  // TODO : currentPage를 추적하는 useEffect -> currentPage가 변할 때 api 요청 다시
  useEffect(() => {}, [currentPage]);

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
              <img onClick={handleOpenModal} className='cursor-pointer' src='edit_button.svg' alt='editButton' />
              {open && (
                <UserEditModal
                  data={profile}
                  onClose={handleCloseModal}
                  // currentImage={profile.imageUrl}
                  onSaveImage={handleSaveImage}
                  onSaveNickName={handleSaveNickName}
                  onSaveHashTag={handleSaveHashTag}
                />
              )}
            </div>
            <div className='mt-[25px]'>
              <p className='text-[16px]'>내 정보를 입력하고 커뮤니티에서 더 많은 유저와 소통해요!</p>
              <div className='mt-[20px] w-[415px] border-b border-[#585858]'></div>
            </div>
          </div>
          <div className='flex justify-center'>
            <img className='mt-[20px] h-[250px] w-[250px] rounded-[125px]' src='/userImage.png' alt='userImg' />
            {/* {profile.imageUrl || '/default_image.png'} */}
          </div>

          <div className='mt-[60px] pl-[65px]'>
            {profile.hashtags.map((hashtag, index) => (
              <div key={index} className='text-[20px] text-[#909700]'>
                #{hashtag}
              </div>
            ))}

            <div className='flex gap-[30px] text-[18px]'>
              <div className='mt-[20px] leading-loose'>
                <div>닉네임</div>
                <div>이름</div>
                <div>이메일</div>
                <div>가입일</div>
              </div>
              <div className='mt-[20px] leading-loose'>
                <p>{profile.nickName}</p>
                <p>{profile.name}</p>
                <p>{profile.email}</p>
                <p>{profile.created_At}</p>
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
            <div className='mt-[100px] h-[434px] w-[602px]'>
              <div className='flex'>
                <p className='ml-[30px]'>날짜</p>
                <p className='ml-[184px]'>제목</p>
              </div>
              {/* 아래 div 안에 모든 게시글 섹션이 들어가야 함 */}
              <div className='mt-[27px] flex flex-col gap-[15px]'>
                {/* ------- 게시글 1개당 섹션, 동적으로 추가 -------- */}
                {posts.map((post) => (
                  <div key={post.id} className='flex items-center'>
                    <div>{post.date}</div>
                    <div className='ml-[44px] flex w-[250px] justify-center'>
                      <p>{post.title}</p>
                    </div>
                    {/* Todo : edit, del 버튼 onClick
                    // Todo :  edit 버튼 => path='edit/:id' 로 이동  */}
                    <img className='ml-auto' src='/edit-btn.png' />
                    <img className='ml-[6px]' src='/delete-btn.png' />
                  </div>
                ))}
                {/* ------- 게시글 1개당 섹션 끝. -------- */}
              </div>
              {/* 페이지네이션 구역 */}
              {/* Todo : get으로 받은 count 계산해서 totalPages... */}
              <div className='pagination-controls mt-[25px] flex flex-col items-center'>
                <div className='flex space-x-2'>
                  <button onClick={() => handleCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    이전
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1} onClick={() => handleCurrentPage(index + 1)} disabled={index + 1 === currentPage} className={`${index + 1 === currentPage ? 'font-bold' : ''}`}>
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => handleCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    다음
                  </button>
                </div>
              </div>
            </div>
            {/* ------- 페이지네이션 끝 ------- */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
