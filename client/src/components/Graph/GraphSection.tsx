/*
 * File Name    : GraphSection.tsx
 * Description  : 그래프 목록에서 하나의 그래프 카드를 그리는 섹션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.22    김민지      Created     그래프 섹션 컴포넌트 분리, 차트 이름 추가, 그래프 연결
 * 2024.09.24    김민지      Modified     그래프 리스트 get, 즐겨찾기, 그래프 추가/삭제
 */

import { deleteGraph } from '../../apis/lifeGraph/graph-api';
import { GraphData } from '../../types/graph-type';
import { CreateListGraph } from './CreateListGraph';

const GraphSection = ({ title, createdAt, updatedAt, events, id, activeStarId, changeActiveStar }: GraphData) => {
  const isActive = activeStarId === id; // 현재 활성화 스타와 비교해서 그래프가 활성화된 스타인지 확인

  const changeStar = () => {
    changeActiveStar(isActive ? null : id); // 클릭 시 활성화 상태 변경
  };
  console.log(events);

  return (
    <div className='flex w-[380px] flex-col'>
      <div className='mb-[5px] flex justify-end gap-[10px]'>
        <img src='/edit-btn.png' className='cursor-pointer' />
        <img
          src='/delete-btn.png'
          className='cursor-pointer'
          onClick={() => {
            deleteGraph(id);
          }}
        />
      </div>
      <div className='flex w-[380px] bg-[#F8F8F8] hover:shadow-md'>
        <div className='mt-[30px]'>
          <div className='h-[220px] w-[380px]'>
            <CreateListGraph events={events}></CreateListGraph>
          </div>
          <div className=''>
            <div className='flex items-center justify-between pl-[15px]'>
              <img src={`/${isActive ? 'yellowStar.png' : 'grayStar.png'}`} onClick={changeStar} className='cursor-pointer' />
              <div className='p-[5px] text-right'>
                <div className='text-[#8D8B67]'>{title}</div>
                <div className='flex justify-end gap-[20px] text-[#8D8B67]'>
                  <div>생성일</div>
                  <div>{createdAt.slice(0, 10)}</div>
                </div>
                <div className='flex justify-end gap-[20px]'>
                  <div>수정일</div>
                  <div>{updatedAt.slice(0, 10)}</div>
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
