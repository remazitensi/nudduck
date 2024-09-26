import React from 'react';

interface ExpertCardProps {
  expert: Record<string, any>;
  setOpen: (val: boolean) => void;
}

const ExpertCard = ({ expert, setOpen }: ExpertCardProps) => {
  const closeModal = () => {
    setOpen(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains('modal')) return;
    closeModal();
  };

  const formatHashtags = (tags: string) => {
    return tags
      .split(',') // 쉼표로 분리
      .map((tag) => `#${tag.trim().replace(/\s+/g, '')}`) // 앞뒤 공백 제거 후 # 추가
      .join(' '); // 공백으로 구분하여 다시 문자열로 변환
  };

  return (
    <div className='modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50' onClick={handleBackgroundClick}>
      <div
        className='modal-content relative flex justify-start rounded-[20px] bg-white p-6'
        style={{
          width: '800px', // 고정된 너비 설정
          height: '400px', // 고정된 높이 설정
        }}
      >
        <div className='m-[20px] flex w-[220px] flex-col items-center rounded-lg bg-[#FAFAFA]'>
          <img
            src={expert.profileImage}
            alt={`${expert.name} 프로필`}
            className='profile-image mt-[25px] h-[150px] w-[150px] rounded-lg'
            style={{
              boxShadow: '0 8px 10px rgba(0, 0, 0, 0.15)',
              borderRadius: '23px',
            }}
          />
          <p className='mt-[25px] text-sm font-medium text-gray-600'>{expert.jobTitle}</p>
          <p className='text-lg font-bold text-[#7D7D48]'>{expert.name}</p>
          <p className='mt-[5px] text-sm text-gray-500'>
            {formatHashtags(expert.hashtags)} {/* 해시태그 표시 */}
          </p>
        </div>
        <div className='expert-details flex w-[460px] flex-col rounded-lg bg-[#FBFAEC] p-6'>
          {/* 해시태그 */}
          <p className='mb-[8px] text-sm font-bold text-[#7D7D48]'>
            {formatHashtags(expert.hashtags)} {/* 해시태그 표시 */}
          </p>

          {/* 데이터를 두 열로 정렬 */}
          <div className='grid grid-cols-[auto,1fr] gap-x-10 gap-y-1'>
            <p className='font-bold'>이름</p>
            <p>{expert.name}</p>

            <p className='font-bold'>나이</p>
            <p>{expert.age}</p>

            <p className='font-bold'>이메일</p>
            <p>{expert.email}</p>

            <p className='font-bold'>연락처</p>
            <p>{expert.phone}</p>

            <p className='font-bold'>가격</p>
            <p>{expert.cost}원</p>
          </div>
          <br />
          <p>{expert.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
