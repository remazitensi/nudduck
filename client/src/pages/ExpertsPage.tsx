import { useEffect, useState } from 'react';
import { fetchExperts } from '../apis/expertspage-api';
import ExpertCard from './ExpertCard';

const ExpertsPage = () => {
  const [experts, setExperts] = useState<any[] | null>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);

  const fetchExpertList = async () => {
    try {
      const data = await fetchExperts(page, limit);
      setExperts(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {}
  };

  useEffect(() => {
    fetchExpertList();
  }, [page]);

  const handleCardClick = (expert: any) => {
    setSelectedExpert(expert);
    setOpen(true);
  };

  const totalPages = Math.ceil(totalCount / limit);
  const [startPage, setStartPage] = useState(1);
  const endPage = Math.min(startPage + 4, totalPages); // 5개씩 페이지 표시

  const handlePageChange = (newPage: number) => {
    if (newPage > totalPages || newPage < 1) return;
    setPage(newPage);

    // 페이지 그룹 변경: 5 단위로 페이지 그룹을 조정
    if (newPage > endPage) {
      setStartPage(startPage + 5);
    } else if (newPage < startPage) {
      setStartPage(startPage - 5);
    }
  };

  const formatHashtags = (tags: string) => {
    return tags
      .split(',') // 쉼표로 분리
      .map((tag) => `#${tag.trim().replace(/\s+/g, '')}`) // 앞뒤 공백 제거 후 # 추가
      .join(' '); // 공백으로 구분하여 다시 문자열로 변환
  };

  return (
    <div className='item-center mb-[50px] flex justify-center bg-[#fcfcf8]'>
      <div className='mt-[70px] flex w-[1300px] flex-col items-center justify-center'>
        <div className='text-[28px] font-bold'>전문가 상담</div>
        <div className='mt-[10px] w-[200px] border-b-4 border-[#909700]'></div>{' '}
        <div className='flex w-[1200px] flex-wrap justify-center'>
          {experts?.map((expert: any) => (
            <div
              key={expert.id}
              className='m-[30px] flex h-[350px] w-[240px] flex-col items-center justify-center rounded-lg bg-[#FAFAFA] shadow-lg hover:shadow-md'
              onClick={() => handleCardClick(expert)}
            >
              <img
                src={expert.profileImage}
                alt={`${expert.name} 프로필`}
                className='mt-[25px] h-[150px] w-[150px] rounded-lg object-cover'
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
              <button
                className='mb-[20px] mt-[20px] rounded-lg bg-[#C7C4A7]'
                style={{
                  padding: '3px 3px',
                  width: '60px',
                  fontSize: '16px',
                }}
              >
                자세히
              </button>
            </div>
          ))}
        </div>
        {/* 모달을 ExpertCard에서 렌더링 */}
        {open && selectedExpert && <ExpertCard expert={selectedExpert} setOpen={setOpen} />}
        <div className='pagination-controls mt-10 flex flex-row justify-center space-x-2'>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`rounded px-3 py-1 ${page === 1 ? 'cursor-not-allowed text-gray-400' : 'text-black'}`}>
            이전
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button key={startPage + index} onClick={() => handlePageChange(startPage + index)} disabled={startPage + index === page} className={startPage + index === page ? 'font-bold' : ''}>
              {startPage + index}
            </button>
          ))}
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className={`rounded px-3 py-1 ${page === totalPages ? 'cursor-not-allowed text-gray-400' : 'text-black'}`}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;
