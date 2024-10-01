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
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, baseApi } from '../../apis/base-api';
import { editPost, getPostDetail } from '../../apis/community/community-post-api';
import { CommentsDto, UserInfo } from '../../types/comments-type';
import { Post } from '../../types/community-type';

const CommunityPostEdit: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLTextAreaElement>(null); // textarea에 대한 참조
  const [view, setView] = useState(false);
  const [typing, setTyping] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('카테고리 선택');
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
    content: '', // content 필드 추가
  });
  const [comments, setComments] = useState<CommentsDto[]>([]);
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [info, setInfo] = useState<UserInfo | null>(null);

  // 제목 입력 처리
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostData((prevData) => ({
      ...prevData,
      title: value,
    }));
  };

  // 본문 입력 처리
  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPostData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  // 카테고리 변경 처리
  const handleCategoryChange = (newCategory: string) => {
    setPostData((prevData) => ({
      ...prevData,
      category: newCategory,
    }));
    setCategory(newCategory);
    setView(false); // 카테고리를 선택한 후 드롭다운 닫기
  };

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

  // 영어 카테고리를 한글로
  const getCategoryInKorean = (categoryValue: string) => {
    switch (categoryValue) {
      case 'interview':
        return '면접';
      case 'meeting':
        return '모임';
      case 'study':
        return '스터디';
      case 'talk':
        return '잡담';
      default:
        return '카테고리 선택';
    }
  };

  // 게시글을 저장하는 함수
  const savePost = async () => {
    // const content = editorRef.current?.value || '';
    if (!postData.title) return alert('제목을 입력해주세요!');
    if (!postData.content) return alert('내용을 입력해주세요!');
    if (postData.content.length < 10) return alert('내용을 10자 이상 입력해주세요!');
    if (!category) return alert('카테고리를 선택해주세요!');

    // 카테고리 값 변환
    let categoryValue;
    // switch (category) {
    //   case '면접':
    //     categoryValue = 'interview';
    //     break;
    //   case '모임':
    //     categoryValue = 'meeting';
    //     break;
    //   case '스터디':
    //     categoryValue = 'study';
    //     break;
    //   case '잡담':
    //     categoryValue = 'talk';
    //     break;
    //   default:
    //     return alert('카테고리 설정이 필요합니다!');
    // }

    const post = {
      title: postData.title,
      content: postData.content,
      category: category,
    };

    try {
      await editPost(post, id);
      alert('게시글이 수정되었습니다! ✏');
      navigate(`/community`);
    } catch (error: any) {
      alert(error.message.message || '게시글 저장 중 에러가 발생했습니다.');
    }
  };

  const fetchPostDataWithComment = async () => {
    try {
      if (id) {
        const data = await getPostDetail(Number(id));
        setPostData(data);
        setCategory(data.category); // 가져온 카테고리를 선택한 카테고리로 설정
        return data.userId;
      }
    } catch (err) {
      console.error('Error fetching post data:', err);
    }
  };

  // 로그인 유저(이용자) 정보 호출 API
  const userInfo = async (): Promise<UserInfo | void> => {
    try {
      const response = await baseApi.get<UserInfo>(`${api.myPage}/info`, {});
      setInfo(response.data);
      return response.data.id;
    } catch (error: any) {
      return alert(error.message);
    }
  };

  // 페이지 최초 랜더링 시 게시글 상세와 댓글 불러오기, 조회수 증가
  useEffect(() => {
    fetchPostDataWithComment();
    userInfo();
    // if (postData.userId !== info?.id) {
    //   alert('접근할 수 없습니다!');
    //   navigate(`/community`);
    // }
  }, [id]);

  return (
    <div className='community-titles flex flex-col items-center bg-[#fcfcf8]'>
      <div className='mt-[70px] flex flex-col items-center' onClick={() => navigate('/community')}>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[200px] border-b-4 border-[#909700]'></div>{' '}
      </div>

      <div className='mt-[120px] flex w-[1300px]'>
        <div className='flex gap-[20px]'>
          <div className='text-[24px] font-bold'>게시글 작성</div>
          <div className='relative m-auto h-[40px] w-[150px] border bg-white'>
            <ul onClick={() => setView(!view)} className='flex cursor-pointer p-[5px]'>
              <li className='flex w-full items-center'>
                {getCategoryInKorean(category)}
                <img className='ml-auto' src={view ? '/up_arrow.png' : '/down_arrow.png'} alt='arrow' />
              </li>
            </ul>
            {view && (
              <ul className='absolute left-0 top-full z-10 mt-[5px] w-full border-t bg-white shadow-md'>
                <li onClick={() => handleCategoryChange('interview')} className='p-[5px] hover:bg-gray-100'>
                  면접
                </li>
                <li onClick={() => handleCategoryChange('meeting')} className='p-[5px] hover:bg-gray-100'>
                  모임
                </li>
                <li onClick={() => handleCategoryChange('study')} className='p-[5px] hover:bg-gray-100'>
                  스터디
                </li>
                <li onClick={() => handleCategoryChange('talk')} className='p-[5px] hover:bg-gray-100'>
                  잡담
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 제목 입력 */}
      <div className='mt-[10px] w-[1300px]'>
        <input
          value={postData.title} // 제목 상태 바인딩
          onChange={onTitleChange}
          className='h-[60px] w-full rounded-[10px] border bg-white pl-[35px] text-[20px] text-[#808080]'
          placeholder='게시글의 주제나 목적이 드러날 수 있도록 작성해 주세요'
        />
      </div>

      {/* 본문 입력 */}
      <div className='mt-[40px] w-[1300px] rounded-[10px] border bg-white'>
        <textarea
          value={postData.content} // 본문 상태 바인딩
          onChange={onContentChange}
          className='m-[30px] w-[1240px] resize-none overflow-auto'
          rows={10}
          placeholder='30자 이상 입력해주세요.'
        />
      </div>

      {/* 저장 및 취소 버튼 */}
      <div className='mb-[70px] flex w-[1300px] justify-end gap-[23px] p-[20px]'>
        <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#FFC5C3] text-[24px] text-pink-50 hover:text-white' onClick={() => navigate('/community')}>
          취소
        </button>
        <button className='h-[50px] w-[140px] items-center rounded-[10px] bg-[#AEAC9A] text-[24px] text-[#DAD7B9] hover:text-white' onClick={savePost}>
          저장
        </button>
      </div>
    </div>
  );
};

export default CommunityPostEdit;
