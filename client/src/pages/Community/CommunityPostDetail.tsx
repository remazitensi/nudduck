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
import { getComments } from '../../apis/community/community-comments-api';
import { getPostDetail } from '../../apis/community/community-post-api';
import AnotherUserModal from '../../components/Community/AnotherUserModal';
import { CategoryBtn } from '../../components/Community/CategoryBtn';
import { CommentSection } from '../../components/Community/CommentSection';
import { CreateComment } from '../../components/Community/CreateComment';
import { CommentsDto, CommentsResDto } from '../../types/comments-type';
import { Post } from '../../types/community-type';

const CommunityPostDetail: React.FC = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState<Post>({
    postId: 0,
    title: '',
    viewCount: 0,
    createdAt: '',
    category: '',
    imageUrl: '',
    userId: 0,
    nickname: '',
  });
  const [comments, setComments] = useState<CommentsDto[]>([]); // 댓글 목록 state 추가
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(0);

  const handleOpenModal = () => {
    setOpenUserModal(true);
  };

  const handleCloseModal = () => {
    setOpenUserModal(false);
  };

  const fetchPostDataWithComment = async () => {
    try {
      if (id) {
        const data = await getPostDetail(Number(id));
        setPostData(data);
      }
    } catch (err) {
      console.error('Error fetching post data:', err);
    }
  };

  // 댓글 조회 함수
  const fetchComments = async () => {
    try {
      const data: CommentsResDto = await getComments(Number(postData.postId));
      setComments(data.comments);
      setTotalPage(data.total);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
    await console.log(comments);
  };

  // postData.postId가 업데이트될 때 댓글 가져오기
  useEffect(() => {
    if (postData.postId !== 0) {
      fetchComments();
    }
  }, [postData.postId]);

  // 페이지 최초 랜더링 시 게시글 상세와 댓글 불러오기, 조회수 증가
  useEffect(() => {
    fetchPostDataWithComment();

    const timer = setTimeout(async () => {
      try {
        await baseApi.post(`${api.community}/articles/${id}/views`, {});
        console.log('조회수 증가 요청 성공');
      } catch (err) {
        console.error('조회수 증가 요청 실패:', err);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [id]);

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
          <div className='mb-[5px] flex items-center justify-end gap-[5px]' onClick={handleOpenModal}>
            <div className='h-[50px] w-[50px] rounded-full'>
              <img className='rounded-full object-cover' src={postData.imageUrl ? postData.imageUrl : '/default-img.png'} alt='profile_Img' />
            </div>
            <div>{postData.nickname}</div>
          </div>
        </div>
      </div>

      <div className='mt-[50px] h-[500px] w-[1200px]'>
        <div className='relative h-[500px] w-[1200px] rounded-[20px] border'>
          <div className='whitespace-pre-line p-[50px] text-[16px] leading-loose'>{postData.content}</div>
        </div>
      </div>

      <div className='w-[1200px]'>
        <div className='mt-[77px] text-[24px] font-bold'>댓글</div>
        {/* 댓글쓰기 컴포넌트 */}
        <CreateComment postId={postData.postId} onCommentCreated={fetchComments} />

        <div className='Comment my-[58px] flex w-[1200px] flex-col'>
          {/* 댓글 목록을 보여줍니다 */}
          <CommentSection comments={comments}></CommentSection>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
