import React, {useState} from 'react';

import GraphHowModal from './GraphHowModal';
import GraphWriteModal from './GraphWriteModal';

const GraphOk:React.FC = () => {

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

    const handleSaveTitle = (newTitle: string) => {
        setTitle(newTitle);
    }

    const handleSaveOld = (newOld: number) => {
        setOld(newOld);
    }

    const handleSaveScore = (newScore: number) => {
        setScore(newScore);
    }

    const handleSaveEvent = (newEvent: string) => {
        setEvent(newEvent);
    }


    return (
        <div className='graphOk-titles flex w-[1920px] flex-col items-center'>
            <div className='flex flex-col items-center mt-[140px]'>
                <div className='text-[28px] font-bold text-[#909700]'>취업준비생 &nbsp;<span className="text-black">의 인생그래프</span></div>
                <div className='mt-[10px] w-[330px] border-b-2 border-[#8D8B67]'></div>
            </div>
            <div className='flex mt-[30px] gap-[35px]'>
                <button onClick={handleOpenHowModal} className="w-[160px] h-[50px] rounded-[10px] bg-[#FFFCDD] font-bold text-[24px] text-center">작성방법</button>
                {isHowModalOpen && (
                    <GraphHowModal onClose={handleCloseHowModal}/>
                )}
                <button onClick={handleOpenWriteModal} className="w-[160px] h-[50px] rounded-[10px] bg-[#909700] font-bold text-[24px] text-white text-center">추가하기</button>
                {isWriteModalOpen && (
                    <GraphWriteModal onClose={handleCloseWriteModal} onSaveTitle={handleSaveTitle} onSaveOld={handleSaveOld} 
                    onSaveScore={handleSaveScore} onSaveEvent={handleSaveEvent} />
                )}
            </div>

            {/* flex-wrap을 주어 해당영역 안에서 자식 요소가 지정된 너비를 넘으면 자동으로 줄바꿈 되는 코드 */}
            <div className='flex w-[1200px] flex-wrap mt-[120px] gap-[25px]'>
                <div className='flex flex-col w-[380px]'>
                    <div className='flex gap-[10px] justify-end mb-[5px]'>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='Edit.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>수정</button>
                        </div>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='delete.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>삭제</button>
                        </div>  
                    </div>
                    <div className='flex bg-[#F8F8F8] w-[380px] h-[320px]'>
                        그래프 들어갈 곳
                    </div>
                </div>

                <div className='flex flex-col w-[380px]'>
                    <div className='flex gap-[10px] justify-end mb-[5px]'>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='Edit.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>수정</button>
                        </div>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='delete.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>삭제</button>
                        </div>  
                    </div>
                    <div className='flex bg-[#F8F8F8] w-[380px] h-[320px]'>
                        그래프 들어갈 곳
                    </div>
                </div>

                <div className='flex flex-col w-[380px]'>
                    <div className='flex gap-[10px] justify-end mb-[5px]'>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='Edit.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>수정</button>
                        </div>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='delete.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>삭제</button>
                        </div>  
                    </div>
                    <div className='flex bg-[#F8F8F8] w-[380px] h-[320px]'>
                        그래프 들어갈 곳
                    </div>
                </div>
                <div className='flex flex-col w-[380px]'>
                    <div className='flex gap-[10px] justify-end mb-[5px]'>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='Edit.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>수정</button>
                        </div>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='delete.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>삭제</button>
                        </div>  
                    </div>
                    <div className='flex bg-[#F8F8F8] w-[380px] h-[320px]'>
                        그래프 들어갈 곳
                    </div>
                </div>

            </div>
        </div>
    )
};

export default GraphOk;