/**
 * File Name    : PostSection.tsx
 * Description  : 게시글 제목이 들어가는 리스트 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김민지      Created     PostSection 동적 추가, 카테고리 컴포넌트 분리
 * 2024.09.13    김민지      Modified
 */

type PostData = {
  post_id: number;
  title: string;
  content: string;
  category: string;
  user_id: number;
  created_at: string;
};

type PostSectionProps = {
  data: PostData;
};

type ButtonProps = {
  category: string;
};

const CategoryBtn: React.FC<ButtonProps> = ({ category }) => {
  const baseStyle = 'h-[35px] w-[85px] cursor-pointer text-center text-[20px]';

  // category에 따른 색상 적용
  const categoryStyle = category === 'stydy' ? 'bg-[#FFC5C3]' : category === 'interview' ? 'bg-[#D6D3C0]' : category === 'meeting' ? 'bg-[#A1DFFF]' : 'bg-[#FFEABA]'; // 기본 스타일 (카테고리 없을 경우)
  return <div className={`${baseStyle} ${categoryStyle}`}>{category}</div>;
};

export const PostSection: React.FC<PostSectionProps> = ({ data }) => {
  return (
    <div className='mt-[10px]'>
      <div className='flex w-full items-center gap-[70px]'>
        <CategoryBtn category={data.category} />
        <div className='text-[20px]'>{data.title}</div>
      </div>
      <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
        <img src='/clover-image.png' alt='cloverImg' />
        <div>{data.user_id}</div>
      </div>
      <div className='flex justify-end text-[20px]'>
        <div className='flex'>
          <div className='text-[#AEAC9A]'>
            조회수<span className='text-[#A1DFFF]'>{/* 50 */}</span>
          </div>
          <div className='ml-[30px] text-[#AEAC9A]'>
            좋아요 <span className='text-[#FFC5C3]'>{/* 100 */}</span>
          </div>
          <div className='ml-[175px] text-[#AEAC9A]'>작성일 {data.created_at.substring(0, 10)}</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
        </div>
      </div>
    </div>
  );
};
