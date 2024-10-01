/*
 * File Name    : GraphEditModal.tsx
 * Description  : 수정 모달
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Created     레이아웃 완성
 * 2024.09.25    김민지      copy        작성 모달 복사본, 수정, 수정 후 페이지 새로고침
 * 2024.10.01    김민지      Modified    input 요소 추가 로직 변경
 */
import React, { useState } from 'react';
import { api, baseApi } from '../../apis/base-api';

type GraphEditModalProps = {
  onClose: () => void;
  graphData: {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    currentAge: number;
    events: { age: number; score: number; title: string; description: string }[];
  };
  onSave: () => void; // 저장 후 그래프 리스트를 업데이트하는 함수
};

const GraphEditModal: React.FC<GraphEditModalProps> = ({ onClose, graphData }) => {
  const [graphTitle, setGraphTitle] = useState(graphData.title); // 전체 그래프 제목
  const [currentAge, setCurrentAge] = useState(String(graphData.currentAge)); // 현재 나이
  const [inputs, setInputs] = useState(
    graphData.events.map((event) => ({
      title: event.title,
      old: String(event.age), // 나이를 문자열로 변환
      score: event.score,
      event: event.description,
    })),
  );

  const [error, setError] = useState({
    graphTitle: '',
    old: '',
    event: '',
    title: '',
  });

  // + 버튼 클릭 시 input 요소 추가
  const handleAddInput = (index: number) => {
    const updatedInputs = [
      ...inputs.slice(0, index + 1), // 현재 인덱스까지의 요소들
      { title: '', old: '', score: 0, event: '' }, // 새로운 빈 입력 필드
      ...inputs.slice(index + 1), // 나머지 요소들
    ];
    setInputs(updatedInputs);
  };

  // - 버튼 클릭 시 input 요소 제거
  const handleRemoveInput = (index: number) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
  };

  // 그래프 제목 저장
  const handleSaveGraphTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGraphTitle(value);

    if (value.length > 15) {
      setError((prev) => ({ ...prev, graphTitle: '15자 이하로 입력해주세요.' }));
    } else {
      setError((prev) => ({ ...prev, graphTitle: '' }));
    }
  };

  // 각 입력 필드에 대한 상태 변경 핸들러
  const handleSaveEventTitle = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputs = [...inputs];
    newInputs[index].title = e.target.value;
    setInputs(newInputs);
  };

  const handleSaveOld = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputs = [...inputs];
    newInputs[index].old = e.target.value;
    setInputs(newInputs);
  };

  const handleSaveScore = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newInputs = [...inputs];
    newInputs[index].score = Number(e.target.value);
    setInputs(newInputs);
  };

  const handleSaveEventDescription = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputs = [...inputs];
    newInputs[index].event = e.target.value;
    setInputs(newInputs);
  };

  // 수정된 데이터 저장 (axios 요청 포함)
  const handleSave = () => {
    const updatedData = {
      currentAge: Number(currentAge),
      title: graphTitle,
      events: inputs.map((input) => ({
        age: Number(input.old),
        score: input.score,
        title: input.title,
        description: input.event,
      })),
    };

    // axios PUT 요청으로 수정된 데이터를 서버에 전송
    baseApi
      .patch(`${api.lifeGraph}/${graphData.id}`, updatedData) // id로 특정 그래프를 업데이트
      .then((response) => {
        // onSave(); // 저장 후 부모 컴포넌트에서 리스트 갱신
        window.location.reload();
        onClose(); // 모달 닫기
      })
      .catch((error) => {
        console.error('수정 실패:', error);
        if (error.response && error.response.status === 400) {
          alert('잘못된 요청입니다. 입력값을 확인해주세요.');
        }
      });
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#585858] bg-opacity-30' onClick={onClose}>
      <div className='flex h-[1000px] w-[700px] flex-col rounded-[20px] bg-white shadow-lg' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-end'>
          <div onClick={onClose} className='flex cursor-pointer flex-wrap p-[20px] text-[24px]'>
            x
          </div>
        </div>
        <div className='pl-[60px]'>
          <div className='mt-[50px] text-[25px] font-bold'>인생 그래프 수정</div>
          <div className='mt-[30px] flex flex-col gap-[5px]'>
            <div>제목</div>
            <input
              value={graphTitle}
              onChange={handleSaveGraphTitle}
              className='h-[40px] w-[300px] rounded-[10px] border bg-[#f3f3f3] pl-[10px] outline-none'
              placeholder='15자 이내로 입력해주세요.'
            />
            {error.graphTitle && <div className='text-red-500'>{error.graphTitle}</div>}
          </div>

          <div className='mt-[10px] flex flex-col gap-[5px]'>
            <div>현재 나이</div>
            <input
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              className='h-[40px] w-[200px] rounded-[10px] border bg-[#f3f3f3] pl-[10px] outline-none'
              placeholder='나이를 입력해주세요'
            />
          </div>

          <div className='mt-[25px] h-[400px] overflow-y-auto overflow-x-hidden'>
            {inputs.map((input, index) => (
              <div key={index} className='mb-[20px]'>
                <div className='flex gap-[10px]'>
                  <div className='Title-input'>
                    <div>이벤트 제목</div>
                    <input
                      value={input.title}
                      onChange={(e) => handleSaveEventTitle(e, index)}
                      className='h-[40px] w-[300px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'
                      placeholder='최대 15자'
                    />
                  </div>

                  <div className='Old-input'>
                    <div>나이</div>
                    <input value={input.old} onChange={(e) => handleSaveOld(e, index)} className='h-[40px] w-[90px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none' placeholder='나이만' />
                  </div>

                  <div className='Score-input'>
                    <div>점수</div>
                    <select value={input.score} onChange={(e) => handleSaveScore(e, index)} className='h-[40px] w-[90px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'>
                      {Array.from({ length: 11 }, (_, i) => i - 5).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='Buttons flex items-center gap-[10px]'>
                    {/* + 버튼: 입력 필드 추가 */}
                    <button onClick={() => handleAddInput(index)} className='flex h-[30px] w-[30px] justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>
                      +
                    </button>

                    {/* - 버튼: 입력 필드 제거, 요소가 1개 남으면 삭제 불가 */}
                    {inputs.length > 1 && (
                      <button onClick={() => handleRemoveInput(index)} className='flex h-[30px] w-[30px] justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>
                        -
                      </button>
                    )}
                  </div>
                </div>

                <div className='Event-input mt-[10px]'>
                  <input
                    value={input.event}
                    onChange={(e) => handleSaveEventDescription(e, index)}
                    className='h-[40px] w-[580px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'
                    placeholder='이벤트 설명을 입력해주세요'
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-[70px] flex h-[50px] w-full justify-center'>
            <button onClick={handleSave} className='flex h-[50px] w-[220px] items-center justify-center rounded-[10px] bg-[#909700] text-[25px] font-bold text-white'>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphEditModal;
