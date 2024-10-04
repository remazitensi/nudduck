/**
 * File Name    : Header.tsx
 * Description  : pages - 탈퇴 모달 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     탈퇴 모달 생성
 * 2024.09.20    김우현      Updated     api 완성()
 */
import React from 'react';
import { deleteAccount } from '../apis/mypage-api';

interface QuitModalProps {
  onClose: () => void;
}

const QuitModal: React.FC<QuitModalProps> = ({ onClose }) => {
  const handleClickQuit = async () => {
    try {
      await deleteAccount(); // 탈퇴처리 api 호출
      // alert('정상적으로 탈퇴처리 되었습니다.'); // 성공 메시지 중복으로 주석
      window.location.href = '/';
      onClose();
    } catch (error) {
      alert('탈퇴 처리중 문제가 발생하였습니다.');
    }
  };

  return (
    <div className='fixed inset-0 flex cursor-default items-center justify-center bg-[#585858] bg-opacity-30' onClick={onClose}>
      <div className='flex h-[770px] w-[555px] flex-col rounded-[20px] bg-white shadow-lg' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-end'>
          <div onClick={onClose} className='cursor-pointer pr-[20px] pt-[20px]'>
            X
          </div>
        </div>
        {/* &nbsp; 한칸 띄우게 해주는 코드 */}
        <div className='mt-[80px] flex justify-center text-[34px] font-bold text-[#626146]'>
          정말&nbsp;<span className='text-[#FFB896]'>탈퇴</span>하시나요?
        </div>
        <div className='mt-[60px] flex justify-center'>
          <div className='flex justify-center'>
            <div className='text-[18px] font-bold'>{/* 취업 준비생 &nbsp;<span className='font-normal'>님!</span> */}</div>
          </div>
        </div>
        <div className='mt-[50px] flex flex-col items-center text-[18px]'>
          <div>탈퇴하시면 인생 그래프와 AI코치 히스토리가 삭제됩니다.</div>
          <div>작성한 게시글은 탈퇴한 사용자의 게시물로 노출됩니다.</div>
          <br />
          <br />
          <div>별도의 확인 없이 회원 탈퇴가 진행되므로</div>
          <div>신중하게 결정해 주세요!</div>
          <br />
          <br />

          <br />
          <br />
          <div>
            누떡은 &nbsp;<span className=''>여러분</span>과 더 오래 함께하고 싶어요.
          </div>
        </div>
        <div className='mt-[50px] flex justify-center gap-[10px]'>
          <button onClick={handleClickQuit} className='flex h-[50px] w-[150px] items-center justify-center rounded-xl bg-[#FFEABA] text-[24px] font-bold'>
            탈퇴
          </button>
          <button onClick={onClose} className='flex h-[50px] w-[150px] items-center justify-center rounded-xl bg-[#909700] text-[24px] font-bold text-white'>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitModal;
