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

import { useNavigate } from 'react-router-dom';
import { PostTitleData } from '../../types/community-type';
import { CategoryBtn } from './CategoryBtn';

type PostSectionProps = {
  data: PostTitleData;
};

export const PostSection: React.FC<PostSectionProps> = ({ data }) => {
  const navigate = useNavigate();

  // 클릭 시 해당 게시글  페이지로 이동
  const handleRoute = () => {
    navigate(`/community/${data.postId}`);
  };

  return (
    <div className='mt-[15px] border-b-2 border-[8D8B67]'>
      <div className='flex w-full items-center gap-[70px]'>
        <CategoryBtn category={data.category} />
        <div className='w-full cursor-pointer text-[20px] hover:font-bold' onClick={handleRoute}>
          {data.title}
        </div>
      </div>

      {/* img와 nickname을 감싸는 div태그에 onClick */}
      <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
        <img src='/clover-image.png' alt='cloverImg' />
        <div>{data.nickname}</div>
      </div>
      {/* ----------------- */}

      <div className='flex justify-end text-[16px]'>
        <div className='flex'>
          <div className='text-[#AEAC9A]'>
            조회수<span className='text-[#A1DFFF]'>{data.viewCount}</span>
          </div>
          {/* 좋아요 삭제 */}
          {/* <div className='ml-[30px] text-[#AEAC9A]'>
            좋아요 <span className='text-[#FFC5C3]'>{data.likes_count}</span>
          </div> */}
          <div className='ml-[320px] text-[#AEAC9A]'>작성일 {data.createdAt.substring(0, 10)}</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
        </div>
      </div>
    </div>
  );
};
