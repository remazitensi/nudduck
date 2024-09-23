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

import React, { useEffect, useState } from 'react';

import { api, baseApi } from '../apis/base-api';
import { GraphSection } from '../components/Graph/GraphSection';
import { GraphData } from '../types/graph-type';
import GraphHowModal from './GraphHowModal';
import GraphWriteModal from './GraphWriteModal';

const LifeGraphList: React.FC = () => {
  const [graphListData, setGraphListData] = useState<GraphData[]>();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [noData, setNoData] = useState<boolean>(false);

  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [old, setOld] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [event, setEvent] = useState('');

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

  // 현재 페이지 업데이트
  const handleCurrentPage = (newCurrentPage: number) => {
    setCurrentPage(newCurrentPage);
  };

  useEffect(() => {
    fetchLifeGraphs(currentPage); // 초기 렌더링 시 데이터 로드
  }, [currentPage]);

  const fetchLifeGraphs = async (page: number) => {
    try {
      const response = await baseApi.get(api.lifeGraph, {
        params: { page }, // 페이지 번호만 전달합니다.
      });
      console.log(response.data);
      setGraphListData(response.data.data); // 응답값 배열로 graphListData 업데이트
      // 데이터가 있으면 noData=false
      if (graphListData) {
        setNoData(false);
      } else {
        setNoData(true);
      }
      const updateTotal = Math.ceil(response.data.totalCount / 6); // 소수는 올림
      setTotalPages(updateTotal); // 총 페이지 수 계산
    } catch (error) {
      console.error('인생그래프를 불러오는데 실패했습니다.', error);
    }
  };

  if (noData) {
    return (
      <div className='graph-titles flex w-[1920px] flex-col items-center'>
        <div className='mt-[140px] flex flex-col items-center'>
          <div className='text-[28px] font-bold text-[#909700]'>
            취업준비생 &nbsp;<span className='text-black'>의 인생그래프</span>
          </div>
          <div className='mt-[10px] w-[330px] border-b-2 border-[#8D8B67]'></div>
        </div>

        <div className='mt-[150px] flex w-[1200px] justify-center'>
          {/* &nbsp; 한칸 띄우게 해주는 코드, leading-loose; 각줄 사이 간격 벌리는 코드 */}
          <div className='text-center text-[32px] font-bold leading-loose text-[#909700]'>
            {/* 취업 준비생&nbsp; */}
            <span className='text-black'>
              아직 인생그래프를 작성하지 않으셨네요
              <br />
              정보를 입력하고 손쉽게 인생그래프를 만들어 보세요!
            </span>
          </div>
        </div>

        <div className='mt-[150px] flex gap-[70px]'>
          <button onClick={handleOpenHowModal} className='h-[50px] w-[160px] rounded-[10px] bg-[#FFFCDD] text-center text-[24px] font-bold hover:border-[2px] hover:border-[#626146]'>
            작성방법
          </button>
          {isHowModalOpen && <GraphHowModal onClose={handleCloseHowModal} />}
          <button onClick={handleOpenWriteModal} className='h-[50px] w-[160px] rounded-[10px] bg-[#909700] text-center text-[24px] font-bold text-white hover:border-[2px] hover:border-[#626146]'>
            작성하기
          </button>
          {isWriteModalOpen && <GraphWriteModal onClose={handleCloseWriteModal} onSaveTitle={setTitle} onSaveOld={setOld} onSaveScore={setScore} onSaveEvent={setEvent} />}
        </div>
      </div>
    );
  } else {
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
          {graphListData &&
            graphListData.map((graphData, graphIndex) => (
              <GraphSection
                key={graphData.id} // id를 key로 사용
                title={graphData.title}
                created_at={graphData.created_at}
                updated_at={graphData.updated_at}
                events={graphData.events}
                id={graphData.id} // 추가된 필드
                current_age={graphData.current_age} // 추가된 필드
              />
            ))}
        </div>
        {/* 페이지네이션 */}
        <div className='pagination-controls mt-4 flex flex-col items-center'>
          <div className='flex space-x-2'>
            <button onClick={() => handleCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => handleCurrentPage(index + 1)} disabled={index + 1 === currentPage} className={`${index + 1 === currentPage ? 'font-bold' : ''}`}>
                {index + 1}
              </button>
            ))}
            <button onClick={() => handleCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default LifeGraphList;
