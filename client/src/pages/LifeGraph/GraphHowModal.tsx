/*
 * File Name    : GraphHowModal.tsx
 * Description  : 작성방법 모달
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Created     레이아웃 완성
 * 2024.09.22    김민지      Modified    차트 이름 div추가
 */

interface GraphHowModalProps {
  onClose: () => void;
}

const GraphHowModal: React.FC<GraphHowModalProps> = ({ onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#585858] bg-opacity-30' onClick={onClose}>
      <div className='flex h-[700px] w-[700px] flex-col rounded-[20px] bg-white shadow-lg' onClick={(e) => e.stopPropagation()}>
        {/* &nbsp; 한칸 띄우게 해주는 코드 */}
        <div className='mt-[30px]'>
          <div className='ml-[60px] flex flex-col'>
            <div className='text-[20px] font-bold'>어떻게 작성해야 하나요?</div>
            <div className='mt-[15px] text-[16px]'>그래프 제작에 필요한 그래프 제목과 현재 나이를 입력합니다.</div>
            <div>
              <div className='mt-[10px] text-[16px]'>제목</div>
              <div>
                <input className='text-black-500 mt-[5px] h-[40px] w-[200px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='20살 이후 그래프' readOnly />
              </div>
              <div className='mt-[10px] text-[16px]'>현재 나이</div>
              <div>
                <input className='text-black-500 mt-[5px] h-[40px] w-[200px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='28' readOnly />
              </div>
              <div className='mt-[25px] flex flex-col text-[14px]'>
                <p>제목에는 인생그래프에 넣고 싶은 이벤트를 간략하게 요약합니다.</p>
                <p>이벤트가 발생한 나이와, 이벤트가 영향을 미친 긍/부정 점수를 적습니다.</p>
                <div className='flex items-center space-x-1'>
                  <p>
                    긍/부정 점수는 최소 &nbsp;
                    <span className='text-red-500'>-5점</span>
                    <span>부터 최대 &nbsp;</span>
                    <span className='text-blue-500'>+5점</span>
                    까지 선택 가능합니다.
                  </p>
                </div>
                <p>아래 칸에는 제목에서 적지 못한 구체적인 사항을 메모할 수 있습니다.</p>
              </div>

              <div className='mt-[15px] flex items-center gap-[10px]'>
                <div>
                  <div>제목</div>
                  <div className=''>
                    <input className='h-[40px] w-[300px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='일본 유학 시작' readOnly />
                  </div>
                </div>
                <div>
                  <div>나이</div>
                  <div className=''>
                    <input className='h-[40px] w-[90px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='21' readOnly />
                  </div>
                </div>
                <div>
                  <div>점수</div>
                  <div className=''>
                    <input className='h-[40px] w-[90px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='+4' readOnly />
                  </div>
                </div>
                <div className='flex items-center gap-[10px] pt-[20px]'>
                  <button className='flex h-[30px] w-[30px] justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>+</button>
                  <button className='flex h-[30px] w-[30px] justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>-</button>
                </div>
              </div>
              <div className='mt-[10px]'>
                <input className='h-[40px] w-[580px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='예전부터 꿈꾸던 일본 유학생활을 하게 되었다!' readOnly />
              </div>

              <div className='mt-[20px] text-[14px]'>
                <div className='flex items-center gap-[10px]'>
                  <div>오른쪽</div>
                  <div className='flex h-[20px] w-[20px] items-center justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>
                    <p>+</p>
                  </div>
                  <div>버튼을 눌러서 더 많은 이벤트를 추가해보세요!</div>
                </div>
                <div className='mt-[10px] flex gap-[10px]'>
                  <div className='flex h-[20px] w-[20px] items-center justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>
                    <p>-</p>
                  </div>
                  <div>버튼으로 입력하지 않은 칸을 지울 수 있습니다.</div>
                </div>
                <div className='mt-[10px]'>
                  <div>마지막으로 저장하기 버튼을 눌러 정보를 저장합니다. 잊지 마세요!</div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-[25px] flex justify-center'>
            <button
              onClick={onClose}
              className='flex h-[36px] w-[180px] items-center justify-center rounded-xl border border-[#909700] bg-white text-[18px] font-bold text-[#909700] hover:bg-[#909700] hover:text-white'
            >
              나가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphHowModal;
