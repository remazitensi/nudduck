<<<<<<< HEAD
/**
 * File Name    : Header.tsx
 * Description  : layout - 헤더 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 게시글보기 페이지 생성
 * 2024.09.20    김민지      Modified    게시글 get
 * 2024.09.21    김민지      MOdified    조회수 증가 요청
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, baseApi } from '../../apis/base-api';
import { getPostDetail } from '../../apis/community/community-post-api';
import AnotherUserModal from '../../components/Community/AnotherUserModal';
import { CategoryBtn } from '../../components/Community/CategoryBtn';
import { Post } from '../../types/community-type';

const CommunityPostDetail: React.FC = () => {
  const { id } = useParams(); // URL 파라미터에서 id 가져오기, 구조분해할당
  const [postData, setPostData] = useState<Post>({
    postId: 0,
    title: '',
    viewCount: 0,
    createdAt: '',
    category: '',
    imageUrl: '',
    userId: 0,
    nickname: '',
  }); // postData에 타입 지정
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);

  // path의 postId를 사용해서 get
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (id) {
          const data = await getPostDetail(Number(id)); // 작성한 API 요청 함수 호출
          setPostData(data); // 가져온 데이터를 state에 저장
        }
      } catch (err) {
        console.error('Error fetching post data:', err);
      }
    };

    fetchPostData(); // API 요청 함수 호출

    // 5초 후 조회수 증가 요청
    const timer = setTimeout(async () => {
      try {
        await baseApi.post(`${api.community}/article/${id}/views`, {}); // 조회수 증가 POST 요청
        console.log('조회수 증가 요청 성공');
      } catch (err) {
        console.error('조회수 증가 요청 실패:', err);
      }
    }, 5000); // 5초 후 실행

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, [id]);

  const handleOpenModal = () => {
    setOpenUserModal(true);
  };

  const handleCloseModal = () => {
    setOpenUserModal(false);
  };

  return (
    <div className='community-titles flex flex-col items-center'>
      {openUserModal && <AnotherUserModal onClose={handleCloseModal} userId={postData.userId} />}

      <div className='mt-[140px]'>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[120px] flex w-[1200px] items-center justify-between text-center'>
        <div className='mr-[120px] flex items-center gap-[10px]'>
          <CategoryBtn category={postData.category} />
          <div className='text-[24px]'>{postData.title}</div>
        </div>
        <div className='flex items-center gap-[30px]'>
          <div className='flex gap-[20px]'>
            <div className='flex gap-[8px] text-[#AEAC9A]'>
              <div>작성일</div>
              <div>{postData.createdAt.substring(0, 10)}</div>
            </div>
            <div className='text-[#AEAC9A]'>
              조회수
              <span className='ml-[5px] text-[#A1DFFF]'>{postData.viewCount}</span>
            </div>
          </div>
          {/* img와 nickname을 감싸는 div에 onClick */}
          <div className='mb-[5px] flex items-center justify-end gap-[5px]' onClick={handleOpenModal}>
            <div className='h-[50px] w-[50px] rounded-full'>
              <img className='rounded-full object-cover' src={postData.imageUrl ? postData.imageUrl : '/default-img.png'} alt='profile_Img' />
            </div>{' '}
            <div>{postData.nickname}</div>
          </div>
          {/* --------------------- */}
        </div>
      </div>
      {/* 다른 유저 모달 */}
      <div className='mt-[50px] h-[500px] w-[1200px]'>
        <div className='relative h-[500px] w-[1200px] rounded-[20px] border'>
          <div className='p-[50px] text-[16px] leading-loose'>{postData.content}</div>
          {/* 좋아요 삭제 */}
          {/* <div className='m-0-auto absolute bottom-[30px] left-1/2 flex -translate-x-1/2 transform gap-[5px]'>
            <img className='cursor-pointer hover:opacity-100 hover:drop-shadow-[0_0_0_4px_#909700] hover:invert hover:sepia hover:filter' src='/thumb.png' alt='thumbImg' />
            <div>
              좋아요<span>100</span>
            </div>
          </div> */}
        </div>
      </div>

      <div className='w-[1200px]'>
        <div className='mt-[77px] text-[24px] font-bold'>댓글</div>
        <div className='relative'>
          <div className='mt-[19px] h-[150px] w-[1200px] rounded-[10px] bg-[#F3F3F2] p-[20px] text-[24px] outline-none'>
            <input className='h-full w-full bg-[#F3F3F2] text-[24px] outline-none' placeholder='댓글을 입력해 주세요' />
          </div>
          <button className='absolute right-[20px] top-[90px] h-[40px] w-[95px] rounded-[5px] bg-[#909700] font-bold text-white'>댓글달기</button>
        </div>

        <div className='Comment mt-[58px] flex w-[1200px] flex-col'>
          <div className='flex gap-[10px] pl-[20px] pt-[20px]'>
            <div className='h-[50px] w-[50px] rounded-full'>
              <img className='object-cover' src='/cat_image.png' alt='catImg' />
            </div>
            <div className='flex items-center text-[20px] font-semibold'>스터디구하는자</div>
            <div className='flex items-center text-[12px] text-[#AEAC9A]'>24-09-08 22:22</div>
          </div>
          <div className='pl-[20px] pt-[7px] text-[16px]'>안녕하세요 글 정말 많이 썼네요 무슨 내용인지 모르겠어요</div>
          <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
        </div>

        <div className='Reply mt-[20px] flex w-[1200px] flex-col'>
          <div className='flex gap-[10px] pl-[20px] pt-[20px]'>
            <img className='h-[32px] w-[32px]' src='/reply_arrow.png' alt='replyImg' />
            {/* <img className='' src='/cat_image.png' alt='catImg' /> */}
            <div className='flex items-center text-[20px] font-semibold'>스터디구하는자</div>
            <div className='flex items-center text-[12px] text-[#AEAC9A]'>24-09-08 22:22</div>
          </div>
          <div className='pl-[60px] pt-[7px] text-[16px]'>안녕하세요 대댓글 입니다</div>
          <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
=======
export const CommunityPostDetail = () => {
  return <div>CommunityPostDetail</div>;
};
>>>>>>> feature
