/**
 * File Name    : Header.tsx
 * Description  : layout - 헤더 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 글쓰기 페이지 생성
 */
import React, { useState } from 'react';

import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

const CommunityPostCreate: React.FC = () => {
  const [view, setView] = useState(false);
  const [typing, setTyping] = useState('');
  const [message, setMessage] = useState('');

  // 글지수 유효성 검사
  const onTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTyping(value);

    if (value.length > 30) {
      setMessage('30글자 이하로 적어주세요');
    } else {
      setMessage('');
    }
  };

  return (
    <div className='community-titles flex w-[1920px] flex-col items-center'>
      <div className='mt-[140px]'>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[8D8B67]'></div>
      </div>

      <div className='mt-[120px] flex w-[1300px]'>
        <div className='flex gap-[20px]'>
          <div className='text-[24px] font-bold'>게시글 작성</div>
          <div className='relative m-auto h-[40px] w-[150px] border'>
            <ul
              onClick={() => {
                setView(!view);
              }}
              className='flex cursor-pointer p-[5px]'
            >
              <li className='flex w-full items-center'>
                전체
                <img className='ml-auto' src={view ? 'down_arrow.png' : 'up_arrow.png'} alt='arrow' />
              </li>
            </ul>
            {view && (
              <ul
                className='absolute left-0 top-full z-10 mt-[5px] w-full border-t bg-white shadow-md' // 추가: z-index와 absolute 포지션 설정
              >
                {/* 
                - z-10: 다른 요소들보다 위에 표시되도록 설정
                - absolute: 부모 요소(relative)에 대해 위치 조정
                - top-full: 클릭한 리스트 바로 아래로 표시되도록 설정 
              */}
                <li className='p-[5px] hover:bg-gray-100'>모임</li>
                <li className='p-[5px] hover:bg-gray-100'>스터디</li>
                <li className='p-[5px] hover:bg-gray-100'>잡담</li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className='mt-[10px] w-[1300px]'>
        <input
          value={typing}
          onChange={onTyping}
          className='h-[60px] w-full rounded-[10px] border pl-[35px] text-[24px] text-[#808080]'
          placeholder='게시글의 주제나 목적이 드러날 수 있도록 작성해 주세요'
        />
        {/* 유효성 검사 문구 유효성 검사 함수: onTyping */}
        {message && <p className='mt-[5px] text-red-500'>{message}</p>}
      </div>
      <div className='mt-[40px] h-[800px] w-[1300px] border'>
        <div className='mx-auto mt-[37px] h-[600px] w-[1200px]'>
          <Editor
            // weight='100%'
            height='100%'
            initialEditType='wysiwyg'
            previewStyle='vertical'
            initialValue=' '
          />
          <div className='mt-[80px] flex justify-end gap-[23px]'>
            <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#FFC5C3] text-[24px] text-white'>취소</button>
            <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#AEAC9A] text-[24px] text-[#DAD7B9]'>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCreate;
