/**
 * File Name    : PostSection.tsx
 * Description  : 게시글 제목이 들어가는 리스트 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김민지      Created     PostSection 동적 추가, 카테고리 컴포넌트 분리
 * 2024.09.13    김민지      Modified    카테고리에 따라 이름, 색 변경
 * 2024.09.19    김민지      Modified    게시글 상세페이지 이동, 타입에러 해결, 파일명 변경, CategoryBtn 컴포넌트 분리
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostTitleData } from '../../types/community-type';
import AnotherUserModal from './AnotherUserModal';
import { CategoryBtn } from './CategoryBtn';

type PostSectionProps = {
  data: PostTitleData;
};

export const PostSection: React.FC<PostSectionProps> = ({ data }) => {
  const navigate = useNavigate();
  const [openUserModal, setOpenUserModal] = useState(false);

  // 클릭 시 해당 게시글  페이지로 이동
  const handleRoute = () => {
    navigate(`/community/${data.postId}`);
  };

  const handleOpenModal = () => {
    setOpenUserModal(true);
  };

  const handleCloseModal = () => {
    setOpenUserModal(false);
  };

  return (
    <div className='my-[5px] border-b-2 border-[8D8B67]'>
      {openUserModal && <AnotherUserModal onClose={handleCloseModal} userId={data.userId} />}

      <div className='flex w-full items-center gap-[20px]'>
        <CategoryBtn category={data.category} />
        <div className='cursor-pointer p-[20px] text-[20px] hover:font-bold' onClick={handleRoute}>
          {data.title}
        </div>
        <div className='ml-auto'>
          <div className='flex items-center justify-end'>
            <div className='flex gap-[5px] p-[5px]' onClick={handleOpenModal}>
              <div className='h-[28px] w-[28px] rounded-full'>
                <img className='rounded-full object-cover' src={data.imageUrl ? data.imageUrl : '/default-img.png'} alt='profile_Img' />
              </div>
              <div>{data.nickname}</div>
            </div>
          </div>
          <div className='flex justify-end text-[16px]'>
            <div className='flex items-center'>
              <div className='flex items-center text-[#AEAC9A]'>
                조회수
                <span className='min-w-[40px] text-right text-[#A1DFFF]'>{data.viewCount}</span>
              </div>
              {/* 좋아요 삭제 */}
              {/* <div className='ml-[30px] text-[#AEAC9A]'>
      좋아요 <span className='text-[#FFC5C3]'>{data.likes_count}</span>
    </div> */}
              <div className='ml-[20px] text-[#AEAC9A]'>
                작성일
                <span className='min-w-[100px] text-right'>{data.createdAt.substring(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
