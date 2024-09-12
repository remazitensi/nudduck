import React, { useState } from 'react';
import GraphWriteModal from './GraphWriteModal';

const GraphDetail:React.FC = () => {
    return (
        <div className='graphOk-titles flex w-[1920px] flex-col items-center'>
            <div className='flex flex-col items-center mt-[140px]'>
                <div className='text-[28px] font-bold text-[#909700]'>취업준비생 &nbsp;<span className="text-black">의 인생그래프</span></div>
                <div className='mt-[10px] w-[330px] border-b-2 border-[#8D8B67]'></div>
            </div>

            <div className='flex justify-center w-[1200px] mt-[65px]'>
                <div className='flex flex-col w-full'>
                    <div className='flex gap-[10px] justify-end mb-[20px]'>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='Edit.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>수정</button>
                        </div>
                        <div className='flex justify-center items-center w-[80px] h-[30px] bg-[#FFEABA] rounded-[5px] gap-[10px] cursor-pointer'>
                            <img src='delete.png' className='w-[25px] h-[25px]'/>
                            <button className='flex text-center'>삭제</button>
                        </div>  
                    </div>
                    <div className='flex bg-[#F8F8F8] w-full h-[800px] rounded-[20px]'>
                        그래프 들어갈 곳
                    </div>
                    {/* 스크롤 바 만드는 방법은 세로 스크롤바 인 경우 내가 보여주고자 하는 영역을 정한 후 overflow-x-hidden overflow-y-auto로 하면 영역을 넘어설 경우 자동적으로 생성이 된다  */}
                    <div className="mt-[70px] bg-[#F8F8F8] w-full h-[500px] text-base leading-loose overflow-x-hidden overflow-y-auto">
                        <div className="flex items-center w-[1200px] h-[50px] border-b-2 border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">나이</span>
                            <span className="flex-none w-[200px] text-center">제목</span>
                            <span className="flex-none w-[200px] text-center">점수</span>
                            <span className="flex-none w-[600px] text-center">설명</span>
                            <div className=''></div>
                        </div>

                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        <div className="flex items-center w-[1200px] h-[90px] border-b border-[#8D8B67]">
                            <span className="flex-none w-[200px] text-center">22세</span>
                            <span className="flex-none w-[200px] text-center">무슨대회 입상</span>
                            <span className="flex-none w-[200px] text-center">+3</span>
                            <span className="flex-none w-[500px] text-center">엘리스대학교 무슨대회에서 000을 주제로 출품하여 입상을 수상함 협업 과정을 배울 수 있는 기회였음.</span>
                        </div>
                        
                    </div>
                </div>

                
            </div>
        </div>
    )
};

export default GraphDetail;