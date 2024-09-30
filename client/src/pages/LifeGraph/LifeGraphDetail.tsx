import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteGraph, getDetailGraphData } from '../../apis/lifeGraph/graph-api';
import { CreateDetailGraph } from '../../components/Graph/CreateDetailGraph';
import GraphEditModal from './GraphEditModal';

export const LifeGraphDetail: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pathArray = window.location.pathname.split('/');
  const id = Number(pathArray[pathArray.length - 1]); // 마지막 요소 가져오기
  const navigate = useNavigate();
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      const graphData = await getDetailGraphData(id);
      setData(graphData); // 불러온 데이터를 state에 저장
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>; // 데이터가 없을 경우 로딩 상태 표시
  }

  return (
    <div className='graphOk-titles flex w-full flex-col items-center mb-[50px]'>
      <div className='mt-[70px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-[#909700]'>인생그래프</div>
        <div className='mt-[10px] w-[330px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[65px] flex w-[1200px] justify-center'>
        <div className='flex w-full flex-col'>
          <div className='mb-[20px] flex justify-end gap-[10px]'>
            <div className='mb-[5px] flex justify-end gap-[10px]'>
              <img src='/edit-btn.png' className='cursor-pointer' onClick={() => setModalOpen(true)} />
              {modalOpen && <GraphEditModal onClose={() => setModalOpen(false)} graphData={data} onSave={setData} />}
              <img
                src='/delete-btn.png'
                className='cursor-pointer'
                onClick={async () => {
                  await deleteGraph(id);
                  navigate(`/life-graph`);
                }}
              />
            </div>
          </div>
          <div className='flex h-[800px] w-full rounded-[20px] bg-[#F8F8F8]'>
            <CreateDetailGraph events={data.events}></CreateDetailGraph>
          </div>
          <div className='my-[70px] w-full overflow-y-auto overflow-x-hidden bg-[#F8F8F8] text-base leading-loose'>
            <div className='flex h-[50px] w-[1200px] items-center border-b-2 border-[#8D8B67]'>
              <span className='w-[200px] flex-none text-center'>나이</span>
              <span className='w-[200px] flex-none text-center'>제목</span>
              <span className='w-[200px] flex-none text-center'>점수</span>
              <span className='w-[600px] flex-none text-center'>설명</span>
            </div>
            {/* 동적으로 추가되는 요소 */}
            {data.events.map((event, index) => (
              <div key={index} className='flex h-[90px] w-[1200px] items-center border-b border-[#8D8B67]'>
                <span className='w-[200px] flex-none text-center'>{event.age}세</span>
                <span className='w-[200px] flex-none text-center'>{event.title}</span>
                <span className='w-[200px] flex-none text-center'>{event.score > 0 ? `+${event.score}` : event.score}</span>
                <span className='w-[500px] flex-none text-center'>{event.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
