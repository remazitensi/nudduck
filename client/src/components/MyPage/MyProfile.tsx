/**
 * File Name    : Header.tsx
 * Description  : pages - 프로필 수정 모달 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김우현      Updated     api 완성()
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

  // // api 끝

  return (
    <div>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold'>마이페이지</div>
        <div className='mt-[10px] w-[170px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[80px] flex w-[1200px] gap-[30px]'>
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
      </div>
    </div>
  );
};

export default MyProfile;
