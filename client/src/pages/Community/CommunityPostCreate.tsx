/**
 * File Name    : CommunityPostCreate.tsx
 * Description  : 커뮤니티 게시글 작성 페이지
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 글쓰기 페이지 생성
 * 2024.09.14    김민지      Modified    카테고리 선택 후 닫기 추가
 * 2024.09.20    김민지      Modified    post api 저장하기
 */
import React, { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { createPost } from '../../apis/community/community-post-api';

const CommunityPostCreate: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLTextAreaElement>(null); // textarea에 대한 참조
  const [view, setView] = useState(false);
  const [typing, setTyping] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('카테고리 선택');

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

  // 카테고리를 변경하는 함수
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setView(false); // 카테고리를 선택한 후 드롭다운 닫기
  };

  // 게시글을 저장하는 함수
  const savePost = async () => {
    const content = editorRef.current?.value || ''; // textarea의 내용 가져오기

    if (!typing) return alert('제목을 입력해주세요!');
    if (!content) return alert('내용을 입력해주세요!');
    if (content.length < 10) return alert('내용을 10자 이상 입력해주세요!');
    if (!category) return alert('카테고리를 선택해주세요!');

    // 카테고리 값 변환
    let categoryValue;
    switch (category) {
      case '면접':
        categoryValue = 'interview';
        break;
      case '모임':
        categoryValue = 'meeting';
        break;
      case '스터디':
        categoryValue = 'study';
        break;
      case '잡담':
        categoryValue = 'talk';
        break;
      default:
        return alert('카테고리 설정이 필요합니다!');
    }
    const post = {
      title: typing,
      content: content,
      category: categoryValue,
    };
    console.log(post);

    try {
      // API 호출 및 성공 시 리다이렉트
      await createPost(post);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate(`/community`);
    } catch (error: any) {
      // 에러 발생 시 처리
      alert(error.message.message[0] || '게시글 저장 중 에러가 발생했습니다.');
    }
  };

  return (
    <div className='community-titles flex flex-col items-center bg-[#fcfcf8] p-[70px]'>
      <div className='mt-[70px] flex flex-col items-center' onClick={() => navigate('/community')}>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[200px] border-b-4 border-[#909700]'></div>{' '}
      </div>
      <div className='mt-[120px] flex w-[1300px]'>
        <div className='flex gap-[20px]'>
          <div className='text-[24px] font-bold'>게시글 작성</div>
          <div className='relative m-auto h-[40px] w-[150px] border bg-white'>
            <ul
              onClick={() => {
                setView(!view);
              }}
              className='flex cursor-pointer p-[5px]'
            >
              <li className='flex w-full items-center'>
                {category}
                <img className='ml-auto' src={view ? '/up_arrow.png' : '/down_arrow.png'} alt='arrow' />
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
                <li onClick={() => handleCategoryChange('면접')} className='p-[5px] hover:bg-gray-100'>
                  면접
                </li>
                <li onClick={() => handleCategoryChange('모임')} className='p-[5px] hover:bg-gray-100'>
                  모임
                </li>
                <li onClick={() => handleCategoryChange('스터디')} className='p-[5px] hover:bg-gray-100'>
                  스터디
                </li>
                <li onClick={() => handleCategoryChange('잡담')} className='p-[5px] hover:bg-gray-100'>
                  잡담
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className='mt-[10px] w-[1300px]'>
        <input
          value={typing}
          onChange={onTyping}
          className='h-[60px] w-full rounded-[10px] border pl-[35px] text-[20px] text-[#808080]'
          placeholder='게시글의 주제나 목적이 드러날 수 있도록 작성해 주세요'
        />
        {/* 유효성 검사 문구 유효성 검사 함수: onTyping */}
        {message && <p className='mt-[5px] text-red-500'>{message}</p>}
      </div>
      <div className='mt-[40px] w-[1300px] rounded-[10px] border bg-white'>
        <textarea className='m-[30px] w-[1240px] resize-none overflow-auto' ref={editorRef} rows={10} placeholder='10자 이상 입력해주세요.'></textarea>
        <div className='flex justify-end gap-[23px] p-[20px]'>
          <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#FFC5C3] text-[24px] text-pink-50 hover:text-white' onClick={() => navigate('/community')}>
            취소
          </button>
          <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#AEAC9A] text-[24px] text-[#DAD7B9] hover:text-white' onClick={savePost}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCreate;
