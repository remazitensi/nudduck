/**
 * File Name    : HomePage.tsx
 * Description  : 홈페이지
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     홈페이지 생성
 * 2024.09.21    황솜귤      Modified    홈페이지 레이아웃 구성
 * 2024.09.22    황솜귤      Modified    스타일 시트 수정 및
 * 2024.09.24    황솜귤      Modified    명언/영문장 데이터 추가
 * 2024.09.25    황솜귤      Modified    명언/영문장 전환 로직 추가
 * 2024.09.26    황솜귤      Modified    명언/영문장 섹션 리사이징
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseApi } from '../apis/base-api'; // baseApi 임포트
import LoginModal from '../components/LoginModal';
import './HomePage.css';

// 게시글 타입 정의
interface Post {
  postId: number;
  title: string;
  viewCount: number;
  createdAt: string;
  category: string;
  userId: number;
  nickname: string;
  imageUrl?: string;
}

// 명언 타입 정의
interface Quote {
  id: number;
  author: string;
  authorProfile: string;
  message: string;
}

// 영문장 타입 정의
interface EnglishSentence {
  id: number;
  english: string;
  korean: string;
  note: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [englishSentence, setEnglishSentence] = useState<EnglishSentence | null>(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true); // 명언 또는 영문장 표시 여부
  const [hoverText, setHoverText] = useState<string | null>(null); // 호버 시 표시할 텍스트
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // 마우스 위치
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 모달 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  const openLoginModal = () => {
    setIsLoginModalOpen(true); // 모달 열기
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false); // 모달 닫기
  };

  const navigate = useNavigate();

  // 명언 및 영문장 데이터 가져오기
  useEffect(() => {
    const fetchQuotesAndSentences = async () => {
      try {
        const response = await baseApi.get('/schedule/quotes-and-sentences');
        if (response.status === 200) {
          const { quotes, englishSentences } = response.data;
          setQuote(quotes[0]);
          setEnglishSentence(englishSentences[0]);
        }
      } catch (error) {
        console.error('명언과 영문장을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchQuotesAndSentences();
  }, []);

  // 명언 또는 영문장 전환 함수
  const toggleQuoteAndSentence = () => {
    setIsQuoteVisible((prev) => !prev);
  };

  // 마우스 움직임에 따른 위치 업데이트
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  // 명언 및 영문장 데이터 가져오기, 로그인 상태 확인, 그리고 게시글 데이터 가져오기
  useEffect(() => {
    const fetchQuotesAndSentences = async () => {
      try {
        const response = await baseApi.get('/schedule/quotes-and-sentences');
        if (response.status === 200) {
          const { quotes, englishSentences } = response.data;
          setQuote(quotes[0]);
          setEnglishSentence(englishSentences[0]);
        }
      } catch (error) {
        console.error('명언과 영문장을 가져오는 데 실패했습니다:', error);
      }
    };

    const checkLoginStatus = async () => {
      try {
        // access-token을 통해 로그인 상태 확인
        const response = await baseApi.post('/auth/access-token', {
          // 필요한 경우 refreshToken 등 추가 데이터 전달
        });

        if (response.status === 200 && response.data.accessToken) {
          // 엑세스 토큰이 유효할 경우 로그인 상태로 변경
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false); // 로그아웃 상태로 처리
      }
    };

    const fetchPopularPosts = async () => {
      try {
        const response = await baseApi.get('/community', {
          params: {
            page: 1,
            pageSize: 5,
            limit: 10,
            offset: 0,
            sort: 'viewCount:desc', // 조회수 기준으로 정렬
          },
        });

        if (response.status === 200 && response.data.posts) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error('인기 게시글을 가져오는 데 실패했습니다:', error);
      }
    };

    // 세 가지 비동기 작업 실행
    fetchQuotesAndSentences();
    checkLoginStatus();
    fetchPopularPosts();
  }, []);

  // 게시글 예시 데이터
  useEffect(() => {
    const exampleData: Post[] = [
      {
        postId: 4,
        title: 'Python 웹 개발의 기초',
        viewCount: 152,
        createdAt: '2024-09-23T06:27:44.000Z',
        category: 'study',
        userId: 2,
        nickname: '온뇨쇼쵸몬도',
        imageUrl: 'https://nudduck.s3.ap-northeast-2.amazonaws.com/profile-images/1727627291757-KakaoTalk_20240509_013133377.jpg',
      },
    ];

    setPosts(exampleData);
  }, []);

  return (
    <div className='bg-white-100 min-h-screen bg-[#fcfcf8]'>
      <main className='mx-auto max-w-6xl p-4'>
        {/* Today's Quote Section */}
        <section className='my-6 flex justify-center shadow-xl'>
          <div
            className='relative h-[150px] w-[1100px]'
            onClick={toggleQuoteAndSentence}
            onMouseEnter={() => setHoverText(isQuoteVisible ? '오늘의 영문장으로 전환하기!' : '오늘의 명언으로 전환하기!')}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverText(null)}
          >
            <div className='absolute left-0 top-[6px] h-[140px] w-[1100px] rounded-[5px] bg-white' />
            <div className="absolute left-[31px] top-1/2 h-[29px] w-[175px] -translate-y-1/2 transform text-center font-['Pretendard'] text-2xl font-semibold text-[#909700]">
              {isQuoteVisible ? '오늘의 명언' : '오늘의 영문장'}
            </div>
            <div className="absolute left-[222px] top-[50px] text-left font-['Pretendard'] text-base font-normal text-[#313119]">
              {isQuoteVisible && quote ? (
                <>
                  <div className='text-base'>"{quote.message}"</div>
                  <div className='mt-1 text-sm text-gray-500'>
                    - {quote.author} ({quote.authorProfile})
                  </div>
                </>
              ) : (
                englishSentence && (
                  <>
                    <div>{englishSentence.korean}</div>
                    <div className='text-sm text-gray-500'>({englishSentence.english})</div>
                    <div className='mt-1 text-sm italic text-gray-400'>{englishSentence.note}</div>
                  </>
                )
              )}
            </div>
            {/* 호버 시 나타나는 텍스트 */}
            {hoverText && (
              <div
                style={{
                  position: 'fixed',
                  left: mousePosition.x + 10,
                  top: mousePosition.y + 10,
                  padding: '2px 6px',
                  pointerEvents: 'none',
                }}
                className='animate-bounce text-sm text-[#AEAC9A]'
              >
                {hoverText}
              </div>
            )}
          </div>
        </section>

        {/* 이하 코드는 변경사항 없이 유지됨 */}

        {/* AI Coach Section */}
        {!isLoggedIn && (
          <section className='my-6 flex items-center justify-between rounded bg-white p-6 shadow-xl'>
            <img src='ai-image1.png' alt='AI Coach' className='h-[600px] w-[700px]' />
            <div className='ml-4 flex flex-col'>
              <div className='relative rounded-[10px] bg-[#A1DFFF] p-[20px] shadow-xl'>
                <h3 className='text-xl font-bold text-blue-700'>AI Coach</h3>
                <p className='mt-2 text-[18px] text-gray-700'>
                  <span className='font-bold'>누떡</span>에서 제공하는 AI 서비스는 사용자가 면접 준비를 효율적으로 할 수 있도록 돕는 혁신적인 도구입니다.
                </p>
                <div className='absolute -left-14 top-10 h-0 w-0 border-[30px] border-transparent border-r-[#A1DFFF]'></div>
              </div>
              <p className='m-auto mt-[95px] text-center text-[24px] font-bold'>
                구글, 카카오 아이디가 있으신가요?
                <br />
                <span onClick={openLoginModal} className='cursor-pointer bg-none text-[#909700]'>
                  로그인
                </span>
                하고 하단 메뉴를 이용해 보세요.
              </p>
            </div>
          </section>
        )}

        {/* Feature Cards Section - 로그인 전 상태 */}
        <section className='my-6 mb-12'>
          <h2 className='text-2xl font-bold leading-[30px]'>로그인하고 내 조건에 맞는 서비스 이용하기</h2>
          {/* grid-cols-3 을 4로 변경 */}
          <div className='mt-4 grid grid-cols-1 justify-center gap-4 md:grid-cols-4 pl-[20px]'>
            {' '}
            {/* gap-4로 간격을 반으로 줄였습니다 */}
            {/* 첫 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-[5px] border border-[#313119] bg-[#fbfaec] p-4 shadow-xl'>
              {/* 크기를 줄였습니다 */}
              <div className='absolute left-[15px] top-[76px] text-sm font-semibold leading-[25px] text-[#aeac9a]'>프로필 채우고 나에게 딱 맞는</div>
              <div className='absolute left-[15px] top-[100px] text-lg font-bold leading-[25px] text-black'>AI 가상 면접과 실전 면접 시나리오를 확인해 보세요!</div>
              <button
                className='absolute bottom-[12px] left-1/2 h-[35px] w-[200px] -translate-x-1/2 transform rounded-[5px] bg-[#313119] text-center text-xs font-bold leading-[25px] text-[#aeac9a]'
                onClick={() => navigate('/my-page')} // 버튼 클릭 시 /my-page로 이동
              >
                프로필 입력하기
              </button>
            </div>
            {/* 두 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-[5px] border border-[#313119] bg-white p-4 shadow-xl'>
              {' '}
              {/* 크기를 줄였습니다 */}
              <img src='ai-image2.png' alt='Expert Consulting' className='absolute left-[68px] h-[150px] w-[150px]' />
              <h3 className='absolute left-[15px] top-[160px] text-base font-bold leading-[25px] text-black'>
                {' '}
                {/* 왼쪽 정렬과 크기 조절 */}
                Expert Consulting
              </h3>
              <p className='absolute left-[15px] top-[190px] w-[210px] text-sm font-normal leading-[20px] text-black'>각 분야 전문가의 프로필을 확인하고 1:1 맞춤 상담을 받아 보세요</p>
            </div>
            {/* 세 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-[5px] border border-[#313119] bg-white p-4 shadow-xl'>
              {' '}
              {/* 크기를 줄였습니다 */}
              <img src='ai-image3.png' alt='Community' className='absolute left-[40px] h-[160px] w-[180px]' />
              <h3 className='absolute left-[15px] top-[160px] text-base font-bold leading-[25px] text-black'>
                {' '}
                {/* 왼쪽 정렬과 크기 조절 */}
                Community
              </h3>
              <p className='absolute left-[15px] top-[190px] w-[210px] text-sm font-normal leading-[20px] text-black'>게시판과 채팅방을 통해 누떡 유저들과의 커뮤니티를 형성하세요</p>
            </div>
            {/* 네 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-[5px] border border-[#313119] bg-white p-4 shadow-xl'>
              {' '}
              {/* 크기를 줄였습니다 */}
              <img src='ai-image4.png' alt='Life Graph' className='absolute left-[50px] top-[20px] h-[140px] w-[130px]' />
              <h3 className='absolute left-[15px] top-[160px] text-base font-bold leading-[25px] text-black'>
                {' '}
                {/* 왼쪽 정렬과 크기 조절 */}
                Life Graph
              </h3>
              <p className='absolute left-[15px] top-[190px] w-[210px] text-sm font-normal leading-[20px] text-black'>인생의 여러 가지 사건들을 그래프로 만들어 보세요</p>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className='my-6 mb-12 bg-white shadow-xl'>
          {' '}
          <h2 className='text-2xl font-bold leading-[30px]'>지금 뜨는 게시글</h2>
          <div className='mt-4 space-y-4'>
            {posts.map((post) => (
              <div
                key={post.postId}
                className='cursor-pointer border-b border-[#AEAC9A] p-4 shadow-sm hover:bg-gray-100'
                onClick={() => navigate(`/community/${post.postId}`)} // 게시글 상세 페이지로 이동
              >
                <h3 className='font-bold'>{post.title}</h3>
                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <img src={post.imageUrl || 'https://via.placeholder.com/32'} alt='User Profile' className='h-8 w-8 rounded-full' />
                    <span className='ml-2 text-sm text-gray-500'>{post.nickname}</span>
                  </div>
                  <span className='text-sm text-gray-500'>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 로그인 모달 */}
        {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onLogin={() => {}} />}
      </main>
    </div>
  );
};

export default HomePage;
