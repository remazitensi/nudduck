/*
 * File Name    : GraphWriteModal.tsx
 * Description  : 작성 모달
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Created     레이아웃 완성
 * 2024.09.22    김민지      Modified    차트 이름 div추가
 * 2024.09.24    김민지      Modified    그래프 생성
 */
import React, { useState } from 'react';
import { api, baseApi } from '../apis/base-api';

interface GraphWriteModalProps {
  onClose: () => void;
  onSaveTitle: (title: string, index: number) => void;
  onSaveOld: (old: number, index: number) => void;
  onSaveScore: (score: number, index: number) => void;
  onSaveEvent: (event: string, index: number) => void;
  updateList: () => void;
}

const GraphWriteModal: React.FC<GraphWriteModalProps> = ({ onClose, updateList }) => {
  const [graphTitle, setGraphTitle] = useState(''); // 전체 그래프의 제목
  const [currentAge, setCurrentAge] = useState(''); // 현재 나이
  const [inputs, setInputs] = useState([{ title: '', old: '', score: 0, event: '' }]);

  const [error, setError] = useState({
    graphTitle: '',
    old: '',
    event: '',
    title: '',
  });

  // + 버튼 클릭시 input 요소 추가
  const handleAddInput = () => {
    setInputs([...inputs, { title: '', old: '', score: 0, event: '' }]);
  };

  // - 버튼 클릭시 input 요소 제거
  const handleRemoveInput = (index: number) => {
    const updateInputs = inputs.filter((_, i) => i !== index);
    setInputs(updateInputs);
  };

  // 그래프 제목 저장 (data.title)
  const handleSaveGraphTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGraphTitle(value);

    if (value.length > 15) {
      setError((prev) => ({ ...prev, graphTitle: '15자 이하로 적어주세요.' }));
    } else {
      setError((prev) => ({ ...prev, graphTitle: '' }));
    }
  };

  // 이벤트 제목 저장 (data.events[i].title)
  const handleSaveEventTitle = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index].title = value;

    if (value.length > 15) {
      setError((prev) => ({ ...prev, title: '15자 이하로 적어주세요.' }));
    } else {
      setError((prev) => ({ ...prev, title: '' }));
    }
    setInputs(newInputs);
  };

  // 나이 유효성 검사 및 저장
  const handleSaveOld = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index].old = value;

    if (!/^\d+$/.test(value)) {
      setError((prev) => ({ ...prev, old: '숫자만 입력해 주세요' }));
    } else {
      setError((prev) => ({ ...prev, old: '' }));
    }
    setInputs(newInputs);
  };

  // 점수 저장
  const handleSaveScore = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const value = Number(e.target.value);
    const newInputs = [...inputs];
    newInputs[index].score = value;
    setInputs(newInputs);
  };

  // 이벤트 설명 저장 (data.events[i].description)
  const handleSaveEventDescription = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index].event = value;

    if (value.length > 50) {
      setError((prev) => ({ ...prev, event: '50자 이하로 적어주세요.' }));
    } else {
      setError((prev) => ({ ...prev, event: '' }));
    }
    setInputs(newInputs);
  };

  // 저장 버튼 클릭 시, axios로 데이터 전송
  const handleSave = () => {
    // 이벤트 배열로 변환
    const events = inputs.map((input) => ({
      age: Number(input.old),
      score: input.score,
      title: input.title,
      description: input.event,
    }));

    const requestBody = {
      currentAge: Number(currentAge), // 현재 나이
      title: graphTitle, // 그래프 제목
      events: events, // 이벤트 목록
    };
    console.log(requestBody);

    // axios POST 요청
    baseApi
      .post(api.lifeGraph, requestBody)
      .then((response) => {
        console.log('Data saved successfully:', response.data);
        onClose();
        // todo : get 업데이트
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        if (error.status === 400) {
          alert('빠진 항목이 없는지 확인해주세요!');
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
          <div className='mt-[70px] text-[25px] font-bold'>
            인생 그래프 구성에 대한 정보를
            <br />
            적어주세요!
          </div>
          <div className='mt-[50px] flex flex-col gap-[5px]'>
            <div>제목</div>
            <input
              value={graphTitle}
              onChange={handleSaveGraphTitle} // 그래프 제목 저장
              className='h-[40px] w-[300px] rounded-[10px] border bg-[#f3f3f3] pl-[10px] outline-none'
              placeholder='15자 이내로 입력해주세요.'
            />
            {error.graphTitle && <div className='text-red-500'>{error.graphTitle}</div>}
          </div>
          <div className='mt-[10px] flex flex-col gap-[5px]'>
            <div>현재 나이</div>
            <input
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)} // 현재 나이 저장
              className='h-[40px] w-[200px] rounded-[10px] border bg-[#f3f3f3] pl-[10px] outline-none'
              placeholder='나이를 숫자만 입력해주세요'
            />
          </div>
          <div className='mt-[25px] h-[400px] items-center gap-[10px] overflow-y-auto overflow-x-hidden'>
            {inputs.map((input, index) => (
              <div key={index} className='mb-[20px]'>
                <div className='flex gap-[10px]'>
                  <div className='Title-input'>
                    <div>이벤트 제목</div>
                    <input
                      value={input.title}
                      onChange={(e) => handleSaveEventTitle(e, index)} // 이벤트 제목 저장
                      className='h-[40px] w-[300px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'
                      placeholder='최대 15자'
                    />
                    {error.title && <div className='text-red-500'>{error.title}</div>}
                  </div>
                  <div className='Old-input'>
                    <div>나이</div>
                    <input
                      value={input.old}
                      onChange={(e) => handleSaveOld(e, index)} // 이벤트 나이 저장
                      className='h-[40px] w-[90px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'
                      placeholder='나이만'
                    />
                    {error.old && <div className='text-red-500'>{error.old}</div>}
                  </div>
                  <div className='Score-input'>
                    <div>점수</div>
                    <select
                      value={input.score}
                      onChange={(e) => handleSaveScore(e, index)} // 이벤트 점수 저장
                      className='h-[40px] w-[90px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'
                    >
                      {Array.from({ length: 11 }, (_, i) => i - 5).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='Buttons mt-[10px] flex gap-[10px] pt-[20px]'>
                    <button onClick={handleAddInput} className='flex h-[30px] w-[30px] justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>
                      +
                    </button>
                    <button onClick={() => handleRemoveInput(index)} className='flex h-[30px] w-[30px] justify-center rounded-[6px] bg-[#909700] text-[20px] font-bold text-white'>
                      -
                    </button>
                  </div>
                </div>
                <div className='Event-input mt-[10px] flex'>
                  <input
                    value={input.event}
                    onChange={(e) => handleSaveEventDescription(e, index)} // 이벤트 설명 저장
                    className='h-[40px] w-[580px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none'
                    placeholder='어떤 이벤트가 있었나요? 기억하고 싶은 것을 메모하세요. (선택)'
                  />
                  {error.event && <div className='text-red-500'>{error.event}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='mt-[90px] flex h-[50px] w-full justify-center pl-[20px]'>
          <button onClick={handleSave} className='flex h-[50px] w-[220px] items-center justify-center rounded-[10px] bg-[#909700] text-[25px] font-bold text-white'>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphWriteModal;
