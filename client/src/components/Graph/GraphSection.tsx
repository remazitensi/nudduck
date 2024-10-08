/*
 * File Name    : GraphSection.tsx
 * Description  : 그래프 목록에서 하나의 그래프 카드를 그리는 섹션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.22    김민지      Created     그래프 섹션 컴포넌트 분리, 차트 이름 추가, 그래프 연결
 * 2024.09.24    김민지      Modified    그래프 리스트 get, 즐겨찾기, 그래프 추가/삭제
 * 2024.09.25    김민지      Modified    그래프 상세페이지로 이동
 * 2024.10.01    김민지      Modified    즐겨찾기 로직 변경
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteGraph } from '../../apis/lifeGraph/graph-api';
import GraphEditModal from '../../pages/LifeGraph/GraphEditModal';
import { GraphData } from '../../types/graph-type';
import { changeDateWithFormat } from '../../utils/change-date-with-format';
import { CreateListGraph } from './CreateListGraph';

const GraphSection = ({ data, title, createdAt, updatedAt, events, id, activeStarId, changeActiveStar, updateList }: GraphData) => {
  const isActive = activeStarId === id; // 현재 활성화 스타와 비교해서 그래프가 활성화된 스타인지 확인
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const navigateToDetail = () => {
    navigate(`/life-graph/detail/${id}`); // 클릭 시 해당 id의 상세 페이지로 이동
  };

  const changeStar = () => {
    // 클릭된 그래프가 이미 활성화된 별이라면, 즐겨찾기를 해제하려는 것
    changeActiveStar(isActive ? id : id); // 클릭된 그래프의 ID를 다시 서버로 보내 즐겨찾기 해제 요청
  };

  return (
    <div className='flex w-[380px] flex-col rounded-[30px]'>
      <div className='mb-[5px] flex justify-end gap-[10px]'>
        <img src='/edit-btn.png' className='cursor-pointer' onClick={() => setModalOpen(true)} />
        {modalOpen && <GraphEditModal onClose={() => setModalOpen(false)} graphData={data} onSave={updateList} />}
        <img
          src='/delete-btn.png'
          className='cursor-pointer'
          onClick={async () => {
            await deleteGraph(id);
            updateList();
          }}
        />
      </div>
      <div className='flex w-[380px] rounded-[30px] bg-[#F8F8F8] shadow-md hover:shadow-xl' onClick={navigateToDetail}>
        <div className='mt-[30px]'>
          <div className='h-[220px] w-[380px]'>
            <CreateListGraph events={events}></CreateListGraph>
          </div>
          <div className=''>
            <div className='flex items-center justify-between pl-[15px]'>
              <img
                src={`/${isActive ? 'yellowStar.png' : 'grayStar.png'}`}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 요소로 이벤트가 전파되지 않도록 함
                  changeStar(); // 별 클릭 시 동작
                }}
                className='cursor-pointer'
              />
              <div className='p-5 text-right'>
                <div className='text-[#8D8B67]'>{title}</div>
                <div className='flex justify-end gap-[20px] text-[#8D8B67]'>
                  <div>생성일</div>
                  <div>{changeDateWithFormat(createdAt)}</div>
                </div>
                <div className='flex justify-end gap-[20px]'>
                  <div>수정일</div>
                  <div>{changeDateWithFormat(updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphSection;
