import React, {useState} from 'react';
import GraphHowModal from './GraphHowModal';

import GraphWriteModal from './GraphWriteModal';

const Graph:React.FC = () => {

    const [isHowModalOpen, setIsHowModalOpen] = useState(false);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [old, setOld] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [event, setEvent] = useState('');


    // 작성방법 버튼 클릭시 열기
    const handleOpenHowModal = () => {
        setIsHowModalOpen(true)
    }

    // 작성방법 닫기 버튼
    const handleCloseHowModal = () => {
        setIsHowModalOpen(false)
    }

    // 작성하기 버튼 클릭시 열기
    const handleOpenWriteModal = () => {
        setIsWriteModalOpen(true)
    }

    // 작성하기 닫기 버튼
    const handleCloseWriteModal = () => {
        setIsWriteModalOpen(false)
    }

    return (
        <div className='graph-titles flex w-full flex-col items-center'>
            <div className='flex flex-col items-center mt-[70px]'>
                <div className='text-[28px] font-bold text-[#909700]'>취업준비생 &nbsp;<span className="text-black">의 인생그래프</span></div>
                <div className='mt-[10px] w-[330px] border-b-4 border-[#909700]'></div>
            </div>

            <div className="flex justify-center mt-[150px] w-[1200px]">
                {/* &nbsp; 한칸 띄우게 해주는 코드, leading-loose; 각줄 사이 간격 벌리는 코드 */}
                <div className="text-[32px] font-bold text-[#909700] text-center leading-loose">취업 준비생&nbsp;
                    <span className="text-black">님, 아직 인생그래프를 작성하지 않으셨네요<br/>
                    정보를 입력하고 손쉽게 인생그래프를 만들어 보세요!</span></div>
            </div>
            
            <div className="flex mt-[150px] gap-[70px] mb-[50px]">
                <button onClick={handleOpenHowModal} className="w-[160px] h-[50px] rounded-[10px] bg-[#FFFCDD] font-bold text-[24px] text-center">작성방법</button>
                {isHowModalOpen && (
                    <GraphHowModal onClose={handleCloseHowModal}/>
                )}
                <button onClick={handleOpenWriteModal} className="w-[160px] h-[50px] rounded-[10px] bg-[#909700] font-bold text-[24px] text-white text-center">작성하기</button>
                {isWriteModalOpen && (
                    <GraphWriteModal 
                    onClose={handleCloseWriteModal} onSaveTitle={setTitle} onSaveOld={setOld} onSaveScore={setScore} onSaveEvent={setEvent}/>
                )}
            </div>
        </div>
    )
}

export default Graph;