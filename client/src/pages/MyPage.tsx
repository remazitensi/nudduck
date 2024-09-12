/**
 * File Name    : Header.tsx
 * Description  : pages - 마이페이지 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     마이 페이지 생성
 */
// MyPage.tsx
import React, { useState } from 'react';

import MyProfile from '../components/MyPage/MyProfile'; // MyProfile 컴포넌트 임포트
import QuitModal from './QuitModal';

const MyPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [image, setImage] = useState('/user_image.png');
  const [nickName, setNickName] = useState('');
  const [hashTag, setHashTag] = useState('');

  // 모달 열기/닫기 핸들러
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

  // 이미지, 닉네임, 해시태그 저장 핸들러
  const handleSaveImage = (newImage: string) => {
    setImage(newImage); // 이미지 상태 업데이트
    handleCloseModal();
  };

  const handleSaveNickName = (newNickName: string) => {
    setNickName(newNickName);
    handleCloseModal();
  };

  const handleSaveHashTag = (newHashTag: string) => {
    setHashTag(newHashTag);
    handleCloseModal();
  };

  return (
    <div className='myPage-titles flex w-[1920px] flex-col items-center gap-[10px]'>
      
        {/* MyProfile 컴포넌트를 사용하고 상태와 핸들러들을 props로 전달 */}
        <MyProfile
          open={open}
          image={image}
          nickName={nickName}
          hashTag={hashTag}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          handleSaveImage={handleSaveImage}
          handleSaveNickName={handleSaveNickName}
          handleSaveHashTag={handleSaveHashTag}
        />

      <div className='aaa w-[1200px] h-[780px] bg-[#fafafa] rounded-[20px] shadow-lg'>
            인생그래프
      </div>

      {/* 탈퇴 모달 */}
      <div onClick={handleQuitOpenModal} className='flex mt-[40px] w-[1200px] justify-end gap-[5px] cursor-pointer'>
        <img src='/quit.svg' alt='quit' />
        <div className='flex text-[#8D8B67] text-[15px] items-center'>탈퇴하기</div>
        {quitOpen && <QuitModal onClose={handleQuitCloseModal} />}
      </div>
    </div>
  );
};

export default MyPage;
