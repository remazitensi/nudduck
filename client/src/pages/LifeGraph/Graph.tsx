import React, { useState } from 'react';
import GraphHowModal from './GraphHowModal';

import GraphWriteModal from './GraphWriteModal';

const Graph: React.FC = () => {
  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [_open, _setOpen] = useState(false); // _처리로 상태 변수 사용 x 경고 무시
  const [_title, setTitle] = useState(''); // _처리로 상태 변수 사용 x 경고 무시
  const [_old, setOld] = useState<number>(0); // _처리로 상태 변수 사용 x 경고 무시
  const [_score, setScore] = useState<number>(0); // _처리로 상태 변수 사용 x 경고 무시
  const [_event, setEvent] = useState(''); // _처리로 상태 변수 사용 x 경고 무시

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

  return (
    <div className='graphOk-titles mb-[50px] flex w-full flex-col items-center bg-[#fcfcf8]'>
      <div className='mt-[70px] flex flex-col items-center'>
        <div className='text-[28px] font-bold'>인생 그래프</div>
        <div className='mt-[10px] w-[200px] border-b-4 border-[#909700]'></div>{' '}
      </div>

      <div className='mt-[150px] flex w-[1200px] justify-center'>
        {/* &nbsp; 한칸 띄우게 해주는 코드, leading-loose; 각줄 사이 간격 벌리는 코드 */}
        <div className='text-center text-[32px] font-bold leading-loose text-[#909700]'>
          취업 준비생&nbsp;
          <span className='text-black'>
            님, 아직 인생그래프를 작성하지 않으셨네요
            <br />
            정보를 입력하고 손쉽게 인생그래프를 만들어 보세요!
          </span>
        </div>
      </div>

      <div className='mb-[50px] mt-[150px] flex gap-[70px]'>
        <button onClick={handleOpenHowModal} className='h-[50px] w-[160px] rounded-[10px] bg-[#FFFCDD] text-center text-[24px] font-bold'>
          작성방법
        </button>
        {isHowModalOpen && <GraphHowModal onClose={handleCloseHowModal} />}
        <button onClick={handleOpenWriteModal} className='h-[50px] w-[160px] rounded-[10px] bg-[#909700] text-center text-[24px] font-bold text-white'>
          작성하기
        </button>
        {isWriteModalOpen && <GraphWriteModal onClose={handleCloseWriteModal} onSaveTitle={setTitle} onSaveOld={setOld} onSaveScore={setScore} onSaveEvent={setEvent} />}
      </div>
    </div>
  );
};

export default Graph;
