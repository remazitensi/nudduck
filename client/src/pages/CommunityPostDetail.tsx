/**
 * File Name    : Header.tsx
 * Description  : layout - 헤더 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 게시글보기 페이지 생성
 */
import React from 'react';

const CommunityPostDetail: React.FC = () => {
  return (
    <div className='community-titles flex flex-col items-center'>
      <div className='mt-[140px]'>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[8D8B67]'></div>
      </div>

      <div className='mt-[120px] flex w-[1200px] items-center justify-between text-center'>
        <div className='mr-[120px] flex items-center gap-[10px]'>
          <div className='h-[30px] w-[75px] bg-[#FFC5C3] text-center'>스터디</div>
          <div className='text-[24px]'>1:1 대화방 및 스터디 구합니다</div>
        </div>
        <div className='flex gap-[8px] text-[#AEAC9A]'>
          <div>작성일</div>
          <div>2024-09-09</div>
        </div>
        <div className='text-[#AEAC9A]'>
          조회수
          <span className='ml-[5px] text-[#A1DFFF]'>50</span>
        </div>
        <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
          <img src='/clover-image.png' alt='cloverImg' />
          <div>똑순이 권위자</div>
        </div>
      </div>

      <div className='mt-[50px] h-[500px] w-[1200px]'>
        <div className='relative h-[500px] w-[1200px] rounded-[20px] border'>
          <div className='p-[50px] text-[16px] leading-loose'>
            아아 지금은 서비스를 구현하기 위해서 일부러 글만 적습니다 내용은 아무 의미 없고 각자 내용의 간격을 조정하고 구성하기 위해서 하는 내용이므로 별 뜻이 없어요 첫주차가 지났습니다 모두들 고생
            많으셨어요 아프지 마시고 건강 챙기시면서 하시기를 바랍니다. 2주차부터는 모두가 코딩 타이핑을 치고 있겠군요 기본적인 세팅이 끝이 날 시점 이후부터 지속적으로 계속 새로운 기술들을 구현하게 될
            것 같습니다 드롭다운, 페이지네이션, 소켓을 사용하여 채팅방 구현, 소셜 로그인 구현, AI를 UI화 하여 보여주기 페이지는 다음과 같습니다 첫 페이지, 메인페이지(메인 페이지에서 갈 수있는 경로는
            AI 코치, 전문가 상담, 커뮤니티, 인생그래프 우측 상단 이미지 버튼 클릭시 마이페이지로 갈 수있도록),AI코치에서는 말그대로 AI와 대화할 수 있는 면접, 일상대화, 화술, 경제, 시사 등의 영역을
            포함하는 주제를 담고 있는 내용이 있을 것일테고, 전문가 상담은 페이지만 구현해 놓고 실제로 진행은 하지 않을 것입니다.커뮤니티는 게시판의 형태로 게시판에서 이미지를 클릭할 경우 상대의
            인생그래프를 확인함과 1:1 대화방을 구현하여 원할 경우 1:1 대화를 할 수 있도록 합니다. 그리고 커뮤니티에서는 글쓰기를 할 수 있고, 유저의 게시글을 클릭 할 경우 현재 이 페이지처럼 글을 볼 수
            있습니다. 그리고 이 페이지에서 댓글 달기 기능도 구현할 생각이구요. 인생 그래프는 유저 본인의 인생 그래프를 볼 수 있습니다. 대신 첫 회원가입 유저라면 당연히 인생 그래프가 없겠죠. 그래서
            인생그래프를 만들라고 하고 추가적으로 만드는 방법을 버튼을 만들어서 클릭 시 어떻게 만들어야 하는지 방법에 대해 알려 줄 수 있는 내용을 적어 놓았습니다. 마이페이지에서는 말 그대로 로그인한
            유저의 페이지입니다. 그리고 여기서 본인의 이미지를 변경할 수 있어야 할 테고, 탈퇴하기 기능을 넣었습니다. 탈퇴하기 버튼을 누를 경우 어떻게 UI가 나오는지도 대략 구성을 하였습니다. 이 정도
            글이면 글쓰기 내용이 충분할 것으로 사료됩니다. - 김우현
          </div>
          <div className='m-0-auto absolute bottom-[30px] left-1/2 flex -translate-x-1/2 transform gap-[5px]'>
            <img className='cursor-pointer hover:opacity-100 hover:drop-shadow-[0_0_0_4px_#909700] hover:invert hover:sepia hover:filter' src='/thumb.png' alt='thumbImg' />
            <div>
              좋아요<span>100</span>
            </div>
          </div>
        </div>
      </div>

      <div className='w-[1200px]'>
        <div className='mt-[77px] text-[24px] font-bold'>댓글</div>
        <div className='relative'>
          <input className='mt-[19px] h-[200px] w-[1200px] rounded-[10px] bg-[#F3F3F2] pb-[130px] pl-[20px] text-[24px] outline-none' placeholder='댓글을 입력해 주세요' />
          <button className='absolute right-[20px] top-[160px] h-[50px] w-[95px] rounded-[5px] bg-[#909700] font-bold text-white'>댓글달기</button>
        </div>

        <div className='Comment mt-[58px] flex w-[1200px] flex-col'>
          <div className='flex gap-[10px] pl-[20px] pt-[20px]'>
            <img className='' src='/cat_image.png' alt='catImg' />
            <div className='flex items-center text-[20px] font-semibold'>스터디구하는자</div>
            <div className='flex items-center text-[12px] text-[#AEAC9A]'>24-09-08 22:22</div>
          </div>
          <div className='pl-[20px] pt-[7px] text-[16px]'>안녕하세요 글 정말 많이 썼네요 무슨 내용인지 모르겠어요</div>
          <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
        </div>

        <div className='Reply mt-[20px] flex w-[1200px] flex-col'>
          <div className='flex gap-[10px] pl-[20px] pt-[20px]'>
            <img className='h-[32px] w-[32px]' src='/reply_arrow.png' alt='replyImg' />
            <img className='' src='/cat_image.png' alt='catImg' />
            <div className='flex items-center text-[20px] font-semibold'>스터디구하는자</div>
            <div className='flex items-center text-[12px] text-[#AEAC9A]'>24-09-08 22:22</div>
          </div>
          <div className='pl-[60px] pt-[7px] text-[16px]'>안녕하세요 대댓글 입니다</div>
          <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
