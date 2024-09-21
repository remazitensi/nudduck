/*
 * File Name    : GraphSection.tsx
 * Description  : 그래프 목록에서 하나의 그래프 카드를 그리는 섹션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.22    김민지      Created     그래프 섹션 컴포넌트 분리, 차트 이름 추가
 */

import { useState } from 'react';

export const GraphSection = () => {
  const [star, setStar] = useState('grayStar.png');

  const changeStar = () => {
    setStar((prev) => (prev === 'grayStar.png' ? 'yellowStar.png' : 'grayStar.png'));
  };

  return (
    <div className='flex w-[380px] flex-col'>
      <div className='mb-[5px] flex justify-end gap-[10px]'>
        <div className='flex h-[30px] w-[80px] cursor-pointer items-center justify-center gap-[10px] rounded-[5px] bg-[#FFEABA]'>
          <img src='Edit.png' className='h-[25px] w-[25px]' />
          {/* todo : 수정 이벤트 */}
          <button className='flex text-center'>수정</button>
        </div>
        <div className='flex h-[30px] w-[80px] cursor-pointer items-center justify-center gap-[10px] rounded-[5px] bg-[#FFEABA]'>
          <img src='delete.png' className='h-[25px] w-[25px]' />
          {/* Todo : 삭제 이벤트 */}
          <button className='flex text-center'>삭제</button>
        </div>
      </div>
      <div className='flex w-[380px] bg-[#F8F8F8] hover:shadow-md'>
        <div className='mt-[30px]'>
          {/* todo : 그래프 컴포넌트 */}
          <div className='h-[220px] w-[380px] bg-gray-500'>그래프 자리</div>
          <div className=''>
            <div className='flex items-center justify-center gap-[160px] pl-[15px]'>
              {/* todo : 즐겨찾기 하나 선택하면 다른 하나 풀리게 */}
              <img src={`/${star}`} onClick={changeStar} className='cursor-pointer' />
              <div className='p-[5px]'>
                <div className='flex gap-[20px] text-[#8D8B67]'>
                  <div>차트 이름</div>
                </div>
                <div className='flex gap-[20px] text-[#8D8B67]'>
                  <div>생성일</div>
                  <div>2024-09-06</div>
                </div>
                <div className='flex gap-[20px]'>
                  <div>수정일</div>
                  <div>2024-09-05</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
