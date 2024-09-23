/*
 * File Name    : LifeGraphList.tsx
 * Description  : 그래프 목록을 반환하는 페이지
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Created      레이아웃
 * 2024.09.22    김민지      Modified     컴포넌트 분리, 차트섹션 동적 추가
 */

import React, { useState } from 'react';

import { api, baseApi } from '../apis/base-api';
import { GraphSection } from '../components/Graph/GraphSection';
import GraphHowModal from './GraphHowModal';
import GraphWriteModal from './GraphWriteModal';

const GraphOk: React.FC = () => {
  const [graphListData, setGraphListData] = useState();
  const [totalPages, setTotalPages] = useState();
  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [old, setOld] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [event, setEvent] = useState('');

  const [star, setStar] = useState('grayStar.png');

  const changeStar = () => {
    setStar((prev) => (prev === 'grayStar.png' ? 'yellowStar.png' : 'grayStar.png'));
  };

  // 작성방법 버튼 클릭시 열기
  const handleOpenHowModal = () => {
    setIsHowModalOpen(true);
  };

  // 작성방법 닫기 버튼
  const handleCloseHowModal = () => {
    setIsHowModalOpen(false);
  };

  // 작성하기 버튼 클릭시 열기
  const handleOpenWriteModal = () => {
    setIsWriteModalOpen(true);
  };

  // 작성하기 닫기 버튼
  const handleCloseWriteModal = () => {
    setIsWriteModalOpen(false);
  };

  const handleSaveTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleSaveOld = (newOld: number) => {
    setOld(newOld);
  };

  const handleSaveScore = (newScore: number) => {
    setScore(newScore);
  };

  const handleSaveEvent = (newEvent: string) => {
    setEvent(newEvent);
  };

  const fetchLifeGraphs = async (page: number) => {
    try {
      const response = await baseApi.get(api.lifeGraph, {
        params: { page }, // 페이지 번호만 전달합니다.
      });
      setGraphListData(response.data.data);
      setTotalPages(Math.ceil(response.data.totalCount / 6)); // 총 페이지 수 계산
    } catch (error) {
      console.error('인생그래프를 불러오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchLifeGraphs(currentPage); // 초기 렌더링 시 데이터 로드
  }, [currentPage]);

  return (
    <div className='graphOk-titles flex w-[1920px] flex-col items-center'>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-[#909700]'>
          {/* 유저 정보 필요한 html 삭제 */}
          {/* 취업준비생 &nbsp;<span className='text-black'>의  */}
          인생그래프
          {/* </span> */}
        </div>
        <div className='mt-[10px] w-[330px] border-b-2 border-[#8D8B67]'></div>
      </div>
      <div className='mt-[30px] flex gap-[35px]'>
        <button onClick={handleOpenHowModal} className='h-[50px] w-[160px] rounded-[10px] bg-[#FFFCDD] text-center text-[24px] font-bold'>
          작성방법
        </button>
        {isHowModalOpen && <GraphHowModal onClose={handleCloseHowModal} />}
        <button onClick={handleOpenWriteModal} className='h-[50px] w-[160px] rounded-[10px] bg-[#909700] text-center text-[24px] font-bold text-white'>
          추가하기
        </button>
        {isWriteModalOpen && <GraphWriteModal onClose={handleCloseWriteModal} onSaveTitle={handleSaveTitle} onSaveOld={handleSaveOld} onSaveScore={handleSaveScore} onSaveEvent={handleSaveEvent} />}
      </div>

      {/* flex-wrap을 주어 해당영역 안에서 자식 요소가 지정된 너비를 넘으면 자동으로 줄바꿈 되는 코드 */}
      <div className='mt-[120px] flex w-[1200px] flex-wrap gap-[25px]'>
        {/* graphListData의 event를 map으로 순회하면서 동적으로 GraphSection 생성 */}
        {graphListData.map((graphData, graphIndex) => (
          <GraphSection key={graphIndex} title={graphData.title} created_at={graphData.created_at} updated_at={graphData.updated_at} events={graphData.events} />
        ))}
      </div>
      {/* 페이지네이션 */}
      <div className='pagination-controls mt-4 flex flex-col items-center'>
        <div className='flex space-x-2'>
          <button onClick={() => handleCurrentPage(posts.currentPage - 1)} disabled={posts.currentPage === 1}>
            이전
          </button>
          {Array.from({ length: posts.totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => handleCurrentPage(index + 1)} disabled={index + 1 === posts.currentPage} className={`${index + 1 === posts.currentPage ? 'font-bold' : ''}`}>
              {index + 1}
            </button>
          ))}
          <button onClick={() => handleCurrentPage(posts.currentPage + 1)} disabled={posts.currentPage === posts.totalPages}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphOk;
