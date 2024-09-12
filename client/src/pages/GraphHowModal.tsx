

interface GraphHowModalProps {
    onClose: () => void;
}

const GraphHowModal:React.FC<GraphHowModalProps> = ({onClose}) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#585858] bg-opacity-30" onClick={onClose}>
            <div className="flex flex-col w-[700px] h-[870px] rounded-[20px] bg-white shadow-lg" onClick={(e) =>  e.stopPropagation()}>
                
                {/* &nbsp; 한칸 띄우게 해주는 코드 */}
                <div className='mt-[65px]'>
                    <div className="flex flex-col ml-[60px]">
                        <div className="text-[25px] font-bold">어떻게 작성해야 하나요?</div>
                        <div className="mt-[30px] text-[18px]">그래프 제작에 필요한 현재 나이를 입력합니다.</div>
                        <div>
                            <div className="mt-[25px] text-[18px]">현재 나이</div>
                            <div>
                                <input className="mt-[5px] pl-[10px] w-[200px] h-[40px] bg-[#F8F8F8] rounded-[10px] text-black-500 outline-none" placeholder='28' readOnly/>
                            </div>
                            <div className="flex flex-col mt-[25px] text-[18px]">
                                <p>제목에는 인생그래프에 넣고 싶은 이벤트를 간략하게 요약합니다.</p>
                                <p>이벤트가 발생한 나이와, 이벤트가 영향을 미친 긍/부정 점수를 적습니다.</p>
                                    <div className="flex items-center space-x-1">
                                        <p>긍/부정 점수는 최소 &nbsp;
                                        <span className="text-red-500">-5점</span>
                                        <span>부터 최대 &nbsp;</span>
                                        <span className="text-blue-500">+5점</span>
                                        까지 선택 가능합니다.</p>
                                    </div>
                                <p>아래 칸에는 제목에서 적지 못한 구체적인 사항을 메모할 수 있습니다.</p>    
                            </div>
                            
                            <div className="mt-[15px] flex items-center gap-[10px]">
                                <div>
                                    <div>제목</div>
                                    <div className="">
                                        <input className="w-[300px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none" placeholder="일본 유학 시작" readOnly />
                                    </div>
                                </div>
                                <div>
                                    <div>나이</div>
                                    <div className="">
                                        <input className="w-[90px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none" placeholder="21" readOnly />
                                    </div>
                                </div>
                                <div>
                                    <div>점수</div>
                                    <div className="">
                                        <input className="w-[90px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none" placeholder="+4" readOnly />
                                    </div>
                                </div>
                                <div className="flex items-center gap-[10px] pt-[20px]">
                                    <button className="flex justify-center w-[30px] h-[30px] bg-[#909700] rounded-[6px] text-white font-bold text-[20px]">+</button>
                                    <button className="flex justify-center w-[30px] h-[30px] bg-[#909700] rounded-[6px] text-white font-bold text-[20px]">-</button>
                                </div>   
                            </div>
                            <div className="mt-[10px]">
                                <input className="w-[580px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none" placeholder="예전부터 꿈꾸던 일본 유학생활을 하게 되었다!" readOnly  />
                            </div>

                            <div className="mt-[30px]">
                                <div className="flex gap-[10px]">
                                    <div>오른쪽</div>
                                    <button className="flex justify-center w-[30px] h-[30px] bg-[#909700] rounded-[6px] text-white font-bold text-[20px]">+</button>
                                    <div>버튼을 눌러서 더 많은 이벤트를 추가해보세요!</div>
                                </div>
                                <div className="flex gap-[10px] mt-[20px]">
                                    <button className="flex justify-center w-[30px] h-[30px] bg-[#909700] rounded-[6px] text-white font-bold text-[20px]">-</button>
                                    <div>버튼으로 입력하지 않은 칸을 지울 수 있습니다.</div>
                                </div>
                                <div className="mt-[20px]">
                                    <div>마지막으로 저장하기 버튼을 눌러 정보를 저장합니다.</div>
                                </div>
                                <div className="mt-[20px]">
                                    <div>잊지 마세요!</div>
                                </div>
                            </div>
                        </div>   
                    </div>
                    <div className='flex justify-center mt-[50px]'>
                        <button onClick={onClose} className='flex items-center justify-center rounded-xl w-[220px] h-[50px] bg-white border border-[#909700] text-[#909700] text-[24px] font-bold hover:bg-[#909700] hover:text-white'>나가기</button>
                    </div>
                </div>       
            </div>
        </div>
    )
}

export default GraphHowModal;