/**
 * File Name    : Cate.tsx
 * Description  : 게시글 제목이 들어가는 리스트 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김민지      Created     PostSection 동적 추가, 카테고리 컴포넌트 분리
 * 2024.09.13    김민지      Modified    카테고리에 따라 이름, 색 변경
 * 2024.09.19    김민지      Modified    게시글 상세페이지 이동, 타입에러 해결, 파일명 변경, CategoryBtn 컴포넌트 분리
 */

//todo : 지금 하고 있는 거 - 카테고리btn 컴포넌트 분리 주석 작성
type ButtonProps = {
  category: string;
};

// 카테고리 타입
const categoryName: Record<string, string> = {
  study: '스터디',
  interview: '면접',
  meeting: '모임',
  talk: '잡담',
};

export const CategoryBtn: React.FC<ButtonProps> = ({ category }) => {
  const baseStyle = 'h-[35px] w-[80px] text-center text-[20px] flex justify-center items-center rounded-[5px]';
  // category에 따른 색상 적용
  const categoryStyle = category === 'study' ? 'bg-[#FFC5C3]' : category === 'interview' ? 'bg-[#D6D3C0]' : category === 'meeting' ? 'bg-[#A1DFFF]' : category === 'talk' ? 'bg-[#FFEABA]' : ''; // 기본 스타일이 없을 경우 빈 문자열
  return (
    <div className={`${baseStyle} ${categoryStyle}`}>
      <p>{categoryName[category]}</p>
    </div>
  );
};
