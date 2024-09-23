/*
 * File Name    : LifeGraphList.tsx
 * Description  : 그래프 목록을 반환하는 페이지
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Created      레이아웃
 * 2024.09.22    김민지      Modified     컴포넌트 분리, 차트섹션 동적 추가
 * 2024.09.24    김민지      Modified     그래프 리스트 get, 즐겨찾기, 그래프 추가/삭제
 */

import React, { useEffect, useState } from 'react';
import { api, baseApi } from '../apis/base-api';

import GraphSection from '../components/Graph/GraphSection';
import { GraphData } from '../types/graph-type';
import GraphHowModal from './GraphHowModal';
import GraphWriteModal from './GraphWriteModal';

const LifeGraphList: React.FC = () => {
  const [graphListData, setGraphListData] = useState<GraphData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [noData, setNoData] = useState<boolean>(true); // 개발 완료 후 true로 변경

  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [activeStarId, setActiveStarId] = useState<number | null>(null); // 현재 활성화된 스타 ID

  const changeActiveStar = async (id: number) => {
    setActiveStarId(id); // 클릭한 스타 ID로 활성화
    try {
      await baseApi.post(`${api.lifeGraph}/favorite`, { graphId: id });
      alert('대표 그래프가 설정되었습니다 ✔');
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchLifeGraphs(); // 초기 렌더링 시 데이터 로드
  }, [currentPage]);

  const fetchLifeGraphs = async () => {
    try {
      const page = currentPage;
      const response = await baseApi.get(api.lifeGraph, {
        params: { page, limit: 6 },
      });
      console.log(response.data);
      setGraphListData(response.data.data); // 응답값 배열로 graphListData 업데이트
      console.log('graphListData', graphListData);
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
          <div className='text-center text-[32px] font-bold leading-loose text-[#909700]'>
            <span className='text-black'>
              아직 인생그래프를 작성하지 않으셨네요
              <br />
              정보를 입력하고 손쉽게 인생그래프를 만들어 보세요!
            </span>
          </div>
        </div>

        <div className='mt-[150px] flex gap-[70px]'>
          <button onClick={() => setIsHowModalOpen(true)} className='h-[50px] w-[160px] rounded-[10px] bg-[#FFFCDD] text-center text-[24px] font-bold hover:border-[2px] hover:border-[#626146]'>
            작성방법
          </button>
          {isHowModalOpen && <GraphHowModal onClose={() => setIsHowModalOpen(false)} />}
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className='h-[50px] w-[160px] rounded-[10px] bg-[#909700] text-center text-[24px] font-bold text-white hover:border-[2px] hover:border-[#626146]'
          >
            작성하기
          </button>
          {isWriteModalOpen && <GraphWriteModal updateList={fetchLifeGraphs} onClose={() => setIsWriteModalOpen(false)} />}
        </div>
      </div>
    );
  } else {
    return (
      <div className='graphOk-titles flex w-[1920px] flex-col items-center'>
        <div className='mt-[140px] flex flex-col items-center'>
          <div className='text-[28px] font-bold text-[#909700]'>인생그래프</div>
          <div className='mt-[10px] w-[330px] border-b-2 border-[#8D8B67]'></div>
        </div>
        <div className='mt-[30px] flex gap-[35px]'>
          <button onClick={() => setIsHowModalOpen(true)} className='h-[50px] w-[160px] rounded-[10px] bg-[#FFFCDD] text-center text-[24px] font-bold'>
            작성방법
          </button>
          {isHowModalOpen && <GraphHowModal onClose={() => setIsHowModalOpen(false)} />}
          <button onClick={() => setIsWriteModalOpen(true)} className='h-[50px] w-[160px] rounded-[10px] bg-[#909700] text-center text-[24px] font-bold text-white'>
            추가하기
          </button>
          {isWriteModalOpen && <GraphWriteModal onClose={() => setIsWriteModalOpen(false)} />}
        </div>

        <div className='mt-[120px] flex w-[1200px] flex-wrap gap-[25px]'>
          {graphListData.map((graphData) => (
            <GraphSection
              key={graphData.id}
              title={graphData.title}
              createdAt={graphData.createdAt}
              updatedAt={graphData.updatedAt}
              events={graphData.events}
              id={graphData.id}
              activeStarId={activeStarId} // 활성화된 스타 ID 전달
              changeActiveStar={changeActiveStar} // 스타 변경 함수 전달
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='pagination-controls mt-4 flex flex-col items-center'>
          <div className='flex space-x-2'>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => setCurrentPage(index + 1)} disabled={index + 1 === currentPage} className={`${index + 1 === currentPage ? 'font-bold' : ''}`}>
                {index + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default LifeGraphList;
