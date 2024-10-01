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
 * 2024.09.25    김민지      Modified     리팩토링, 즐겨찾기 에러 수정
 * 2024.10.01    김민지      Modified     즐겨찾기 그래프 해제 추가 및 설정 유지
 */

import React, { useEffect, useState } from 'react';
import { api, baseApi } from '../../apis/base-api';

import { fetchLifeGraphs } from '../../apis/lifeGraph/graph-api';
import GraphSection from '../../components/Graph/GraphSection';
import { GraphData } from '../../types/graph-type';
import GraphHowModal from './GraphHowModal';
import GraphWriteModal from './GraphWriteModal';

const LifeGraphList: React.FC = () => {
  const [graphListData, setGraphListData] = useState<GraphData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [noData, setNoData] = useState<boolean>(false);

  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [activeStarId, setActiveStarId] = useState<number | null>(null); // 현재 활성화된 스타 ID

  // 대표 그래프 변경
  const changeActiveStar = async (id: number | null) => {
    try {
      const response = await baseApi.post(`${api.lifeGraph}/favorite`, { graphId: id });
      // 서버 응답에 따라 별표 상태 업데이트
      if (response.data.isFavorited) {
        setActiveStarId(id); // 서버에서 true를 받으면 활성화
        alert('대표 그래프가 설정되었습니다. ✔');
      } else {
        setActiveStarId(null); // 서버에서 false를 받으면 비활성화
        alert('대표 그래프가 해제되었습니다. ❌');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // 페이지 로드 시 인생 그래프 데이터와 대표 그래프 상태를 서버에서 받아옴
  useEffect(() => {
    updateLifeGraphs();
  }, [currentPage]);

  const updateLifeGraphs = async () => {
    const res = await fetchLifeGraphs(currentPage);
    setGraphListData(res.data);
    console.log(res);
    console.log('graphListData에 저장된 데이터: ', graphListData);
    if (res.data.length === 0) {
      setNoData(true);
    } else if (res.data.length >= 1) {
      setNoData(false);
      setTotalPages(Math.ceil(res.totalCount / 6));

      // 서버에서 받아온 favoriteGraphId로 현재 활성화된 대표 그래프 설정
      setActiveStarId(res.favoriteGraphId);
    }
  };

  if (noData) {
    return (
      <div className='graph-titles flex w-full flex-col items-center bg-[#fcfcf8]'>
        <div className='mt-[70px] flex flex-col items-center' onClick={() => navigate('/life-graph')}>
          <div className='text-[28px] font-bold'>인생 그래프</div>
          <div className='mt-[10px] w-[200px] border-b-4 border-[#909700]'></div>{' '}
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
          {isWriteModalOpen && <GraphWriteModal updateList={updateLifeGraphs} onClose={() => setIsWriteModalOpen(false)} />}
        </div>
      </div>
    );
  } else {
    return (
      <div className='graphOk-titles flex w-full flex-col items-center'>
        <div className='mt-[70px] flex flex-col items-center'>
          <div className='text-[28px] font-bold'>인생 그래프</div>
          <div className='mt-[10px] w-[200px] border-b-4 border-[#909700]'></div>{' '}
        </div>
        <div className='mt-[30px] flex gap-[35px]'>
          <button onClick={() => setIsHowModalOpen(true)} className='h-[50px] w-[160px] rounded-[10px] bg-[#FFFCDD] text-center text-[24px] font-bold'>
            작성방법
          </button>
          {isHowModalOpen && <GraphHowModal onClose={() => setIsHowModalOpen(false)} />}
          <button onClick={() => setIsWriteModalOpen(true)} className='h-[50px] w-[160px] rounded-[10px] bg-[#909700] text-center text-[24px] font-bold text-white'>
            추가하기
          </button>
          {isWriteModalOpen && (
            <GraphWriteModal
              updateList={updateLifeGraphs} // 그래프 목록 업데이트 함수 전달
              onClose={() => setIsWriteModalOpen(false)}
            />
          )}
        </div>

        <div className='mt-[90px] flex w-[1200px] flex-wrap gap-[25px] rounded-[30px]'>
          {graphListData.map((graphData) => (
            <GraphSection
              key={graphData.id}
              data={graphData}
              title={graphData.title}
              createdAt={graphData.createdAt}
              updatedAt={graphData.updatedAt}
              events={graphData.events}
              id={graphData.id}
              activeStarId={activeStarId} // 활성화된 스타 ID 전달
              changeActiveStar={changeActiveStar} // 스타 변경 함수 전달
              updateList={updateLifeGraphs}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='pagination-controls mb-[50px] mt-4 flex flex-col items-center'>
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
