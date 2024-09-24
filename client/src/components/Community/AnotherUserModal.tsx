/**
 * File Name    : AnotherUserModal.tsx
 * Description  : 다른 유저 정보 조회
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김우현      Created     레이아웃 css 적용
 */

import React, { useState } from 'react';

interface anotherUserModalProps {
  onClose: () => void;
}

const AnotherUserModal: React.FC = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#585858] bg-opacity-30' onClick={onClose}>
      {/* // onClick={onClose} */}
      <div className='flex h-[1300px] w-[700px] flex-col rounded-[20px] bg-white pl-[50px] pr-[50px] shadow-lg' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-end'>
          <div onClick={onClose} className='flex cursor-pointer p-[20px] text-[24px]'>
            x
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex gap-[25px]'>
            <img src='../public/AI_image.png' alt='이미지' />
            <div className='flex flex-col items-center justify-center'>
              <div className='text-[24px] font-bold'>최고의 고양이</div>
              <div className='text[16px] font-bold text-[#8D8B67]'>#IT #개발 #기술면접</div>
            </div>
          </div>
          <div className='flex h-[40px] w-[180px] justify-center rounded-[10px] border border-[#8D8B67] hover:border-[#A1DFFF] hover:bg-[#EEF9FF] hover:font-bold'>
            <button className='text-18px]'>1:1 대화 신청하기</button>
          </div>
        </div>
        <div className='mt-[20px] flex flex-col gap-[20px] pl-[30px]'>
          <div className='flex gap-[70px]'>
            <div>이름</div>
            <div>김고양</div>
          </div>
          <div className='flex gap-[55px]'>
            <div>이메일</div>
            <div>ILoveCat@elice.com</div>
          </div>
        </div>
        <div className='mt-[25px] flex h-[330px] w-[600px] items-center justify-center bg-[#eeeeee]'></div>

        <div onClick={() => setIsExpanded(!isExpanded)} className='mt-[10px] cursor-pointer'>
          {isExpanded ? '▼ 접기' : '▶ 자세히보기'}
        </div>
        {isExpanded && (
          <div className='flex justify-center'>
            <div className={`flex items-center justify-center overflow-y-auto ${isExpanded ? 'h-[550px] w-[500px]' : ''}`}>
              <div className='flex w-[550px] flex-col'>
                <div className='flex w-full items-center justify-between border-b border-[#8D8B67] p-[20px]'>
                  <div>나이</div>
                  <div>제목</div>
                  <div>점수</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
                <div className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[20px]'>
                  <div>22세</div>
                  <div>무슨대회 입상</div>
                  <div>+3</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnotherUserModal;
