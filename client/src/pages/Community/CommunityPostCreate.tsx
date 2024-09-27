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

// import '@toast-ui/editor/dist/toastui-editor.css';
// import { Editor } from '@toast-ui/react-editor';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../apis/community/community-post-api';

const CommunityPostCreate: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null); // useRef로 Editor의 값을 참조

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
    const content = editorRef.current?.getInstance().getMarkdown();
    const post = {
      title: typing,
      content: content,
      category: category,
    };

    try {
      // API 호출 및 성공 시 리다이렉트
      await createPost({ post });
      alert('게시글이 성공적으로 저장되었습니다.');
      navigate(`/community`);
    } catch (error: any) {
      // 에러 발생 시 처리
      alert(error.message || '게시글 저장 중 에러가 발생했습니다.');
      navigate(`/community`);
    }
  };

  const toolbarItems = [
    ['heading', 'bold', 'italic', 'strike'],
    ['ul', 'ol', 'task', 'link'],
  ];

  return (
    <div className='community-titles flex flex-col items-center'>
      <div className='mt-[140px] cursor-pointer' onClick={() => navigate('/community')}>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
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
          className='h-[60px] w-full rounded-[10px] border pl-[35px] text-[24px] text-[#808080]'
          placeholder='게시글의 주제나 목적이 드러날 수 있도록 작성해 주세요'
        />
        {/* 유효성 검사 문구 유효성 검사 함수: onTyping */}
        {message && <p className='mt-[5px] text-red-500'>{message}</p>}
      </div>
      <div className='mt-[40px] h-[800px] w-[1300px] border'>
        <div className='mx-auto mt-[37px] h-[600px] w-[1200px]'>
          {/* <Editor
            // weight='100%'
            ref={editorRef}
            height='100%'
            initialEditType='wysiwyg'
            previewStyle='vertical'
            initialValue=' '
            toolbarItems={toolbarItems}
          /> */}
          <div className='mt-[80px] flex justify-end gap-[23px]'>
            <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#FFC5C3] text-[24px] text-pink-50 hover:text-white' onClick={() => navigate('/community')}>
              취소
            </button>
            <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#AEAC9A] text-[24px] text-[#DAD7B9] hover:text-white' onClick={savePost}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCreate;
