/**
 * File Name    : AnotherUserModal.tsx
 * Description  : 다른 유저 정보 조회
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.22    임형선      Created     레이아웃 초안
 * 2024.09.23    김우현      Modified     css 적용
 * 2024.09.26    이승철      Modified     Api 요청 로직 작성
 * 2024.09.27    김민지      Modified     병합 후 인생그래프 삽입
 */

import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../apis/community/community-post-api'; // getUserProfile API 함수 import
import { CreateDetailGraph } from '../Graph/CreateDetailGraph';

interface AnotherUserModalProps {
  onClose: () => void;
  userId: number; // userId를 prop으로 전달받음
}

const AnotherUserModal: React.FC<AnotherUserModalProps> = ({ onClose, userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userData, setUserData] = useState<any>(null); // 프로필 데이터를 저장할 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태 변수

  // useEffect로 userId에 따른 유저 프로필 정보 불러오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setUserData(data);
        return setLoading(false);
      } catch (error) {
        alert('유저 정보를 불러오지 못했습니다.');
        return setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    // todo : 적절한 로딩박스 만들기
    // return <div className='relative z-10'>Loading...</div>; // 로딩 중일 때 표시할 내용
    return;
  }

  return (
    <div className='relative z-10'>
      <div className='fixed inset-0 flex items-center justify-center bg-[#585858] bg-opacity-30' onClick={onClose}>
        <div className='flex w-[700px] flex-col rounded-[20px] bg-white p-[50px] pt-[0px] shadow-lg' onClick={(e) => e.stopPropagation()}>
          <div className='flex justify-between'>
            <div className='mt-[40px] flex items-center justify-between'>
              <div className='flex gap-[20px]'>
                <div className='h-[100px] w-[100px] rounded-full'>
                  <img className='h-full w-full rounded-full object-cover' src={userData.imageUrl ? userData.imageUrl : '/default-img.png'} alt='profile_Img' />
                </div>
                <div className='flex flex-col justify-center'>
                  <div className='text-[24px] font-bold'>{userData.nickname}</div>
                  <div className='text-[20px] font-bold text-[#8D8B67]'>{userData.hashtags?.join(' ') || ''}</div>
                </div>
              </div>
              {/* <div className='flex h-[40px] w-[180px] justify-center rounded-[10px] border border-[#8D8B67] hover:border-[#A1DFFF] hover:bg-[#EEF9FF] hover:font-bold'>
              <button className='text-18px]'>1:1 대화 신청하기</button>
            </div> */}
            </div>

            <div onClick={onClose} className='flex cursor-pointer p-[15px] text-[28px]'>
              x
            </div>
          </div>
          <div className='mt-[14px] flex flex-col gap-[10px] pl-[15px]'>
            <div className='flex gap-[70px]'>
              <div>이름</div>
              <div>{userData.name}</div>
            </div>
            <div className='flex gap-[55px]'>
              <div>이메일</div>
              <div>{userData.email}</div>
            </div>
          </div>
          <div className='mt-[10px] flex h-[300px] w-[600px] items-center justify-center bg-[#eeeeee]'>
            {userData.favoriteLifeGraph ? <CreateDetailGraph events={userData.favoriteLifeGraph.events}></CreateDetailGraph> : <div>좋아하는 인생 그래프가 없습니다.</div>}
          </div>

          {userData.favoriteLifeGraph && (
            <>
              <div onClick={() => setIsExpanded(!isExpanded)} className='mt-[10px] cursor-pointer'>
                {isExpanded ? '▼ 접기' : '▶ 자세히보기'}
              </div>
              {isExpanded && (
                <div className='flex justify-center'>
                  <div className='flex w-[550px] flex-col'>
                    {/* 헤더 부분: 고정 */}
                    <div className='mt-[10px] flex w-full items-center justify-between border-b border-[#8D8B67] p-[10px]'>
                      <div>나이</div>
                      <div>제목</div>
                      <div className='mr-[20px]'>점수</div>
                    </div>

                    {/* 이벤트 목록에만 스크롤 적용 */}
                    <div className={`flex flex-col overflow-y-auto ${isExpanded ? 'h-[200px]' : ''}`}>
                      {userData.favoriteLifeGraph.events.map((event: any, index: number) => (
                        <div key={index} className='flex w-full items-center justify-between border-b border-[#DAD7B9] p-[15px]'>
                          <div>{event.age}</div>
                          <div>{event.title}</div>
                          <div>{event.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnotherUserModal;
