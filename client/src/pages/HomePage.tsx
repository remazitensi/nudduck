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
 * 2024.10.01    황솜귤      Modified    조회순 게시글 조회
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

  // 명언 또는 영문장 전환 함수
  const toggleQuoteAndSentence = () => {
    setIsQuoteVisible((prev) => !prev);
  };

  // 마우스 움직임에 따른 위치 업데이트
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // posts 배열의 변화 감지용 useEffect
  useEffect(() => {
    console.log('현재 posts 상태:', posts);
  }, [posts]);

  // 명언/영문장, 로그인 상태 및 인기 게시글 데이터 가져오기
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
        const response = await baseApi.post('/auth/access-token', {});
        if (response.status === 200 && response.data.accessToken) {
          setIsLoggedIn(true); // 로그인 상태로 설정
        }
      } catch (error) {
        setIsLoggedIn(false); // 로그아웃 상태로 설정
      }
    };

    const fetchPopularPosts = async () => {
      try {
        const response = await baseApi.get('/community', {
          params: {
            page: 1,
            pageSize: 6,
            limit: 10,
            offset: 0,
            sort: 'viewCount:desc',
          },
        });

        console.log('API 응답 데이터:', response.data);

        // response.data가 2차원 배열 형태인 경우 처리
        if (response.status === 200 && Array.isArray(response.data) && Array.isArray(response.data[0])) {
          setPosts(response.data[0]); // 첫 번째 배열 요소를 게시글 목록으로 설정
        } else {
          console.error('API 응답 데이터가 예상과 다릅니다:', response.data);
        }
      } catch (error) {
        console.error('인기 게시글을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchQuotesAndSentences();
    checkLoginStatus();
    fetchPopularPosts();
  }, []);

  return (
    <div className='bg-white-100 min-h-screen bg-[#fcfcf8]'>
      <main className='mx-auto max-w-6xl p-4'>
        {/* Today's Quote Section */}
        <section className='my-6 flex justify-center'>
          <div
            className='relative h-[150px] w-[1100px] rounded-lg border border-gray-300 bg-white p-4 shadow transition-all duration-300 hover:border-[#AEAC9A] hover:shadow-lg'
            onClick={toggleQuoteAndSentence}
            onMouseEnter={() => setHoverText(isQuoteVisible ? '오늘의 영문장으로 전환하기!' : '오늘의 명언으로 전환하기!')}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverText(null)}
          >
            <div className='absolute left-0 top-[6px] h-[140px] w-full rounded-[5px] bg-white' />
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
          <section className='my-6 flex items-center justify-between rounded p-6'>
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
        <section className='mx-auto my-6 max-w-6xl p-6'>
          <h2 className='text-2xl font-bold leading-[30px]'>로그인하고 내 조건에 맞는 서비스 이용하기</h2>
          <div className='mt-4 grid grid-cols-1 justify-center gap-4 md:grid-cols-4'>
            {/* 첫 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-lg border border-gray-300 bg-[#fbfaec] p-4 shadow transition-all duration-300 hover:border-[#AEAC9A] hover:shadow-lg'>
              <div className='absolute left-[15px] top-[76px] text-sm font-semibold leading-[25px] text-[#aeac9a]'>프로필 채우고 나에게 딱 맞는</div>
              <div className='absolute left-[15px] top-[100px] text-lg font-bold leading-[25px] text-black'>AI와의 가상 면접을 체험해 보세요!</div>
              <button
                className='absolute bottom-[12px] left-1/2 h-[35px] w-[200px] -translate-x-1/2 transform rounded bg-[#313119] text-center text-xs font-bold leading-[25px] text-[#aeac9a]'
                onClick={() => navigate('/my-page')} // 버튼 클릭 시 /my-page로 이동
              >
                프로필 입력하기
              </button>
            </div>

            {/* 두 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-lg border border-gray-300 bg-white p-4 shadow transition-all duration-300 hover:border-[#AEAC9A] hover:shadow-lg'>
              <img src='ai-image2.png' alt='Expert Consulting' className='absolute left-[68px] h-[150px] w-[150px]' />
              <h3 className='absolute left-[15px] top-[160px] text-base font-bold leading-[25px] text-black'>Expert Consulting</h3>
              <p className='absolute left-[15px] top-[190px] w-[210px] text-sm font-normal leading-[20px] text-black'>각 분야 전문가의 프로필을 확인하고 1:1 맞춤 상담을 받아 보세요</p>
            </div>

            {/* 세 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-lg border border-gray-300 bg-white p-4 shadow transition-all duration-300 hover:border-[#AEAC9A] hover:shadow-lg'>
              <img src='ai-image3.png' alt='Community' className='absolute left-[40px] h-[160px] w-[180px]' />
              <h3 className='absolute left-[15px] top-[160px] text-base font-bold leading-[25px] text-black'>Community</h3>
              <p className='absolute left-[15px] top-[190px] w-[210px] text-sm font-normal leading-[20px] text-black'>게시판과 채팅방을 통해 누떡 유저들과의 커뮤니티를 형성하세요</p>
            </div>

            {/* 네 번째 카드 */}
            <div className='relative h-[260px] w-[240px] rounded-lg border border-gray-300 bg-white p-4 shadow transition-all duration-300 hover:border-[#AEAC9A] hover:shadow-lg'>
              <img src='ai-image4.png' alt='Life Graph' className='absolute left-[50px] top-[20px] h-[140px] w-[130px]' />
              <h3 className='absolute left-[15px] top-[160px] text-base font-bold leading-[25px] text-black'>Life Graph</h3>
              <p className='absolute left-[15px] top-[190px] w-[210px] text-sm font-normal leading-[20px] text-black'>인생의 여러 가지 사건들을 그래프로 만들어 보세요</p>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className='mx-auto my-6 max-w-6xl p-6'>
          <h2 className='mb-4 text-2xl font-bold'>지금 뜨는 게시글</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posts.length > 0 ? (
              posts.map((post) => {
                // postId 값이 유효한지 확인
                if (!post.postId || isNaN(post.postId)) {
                  console.warn('Invalid postId:', post.postId);
                  return null; // 유효하지 않은 postId인 경우 렌더링하지 않음
                }

                // 날짜 값 검증
                const postDate = new Date(post.createdAt);
                const isValidDate = !isNaN(postDate.getTime());

                return (
                  <div
                    key={post.postId}
                    className='flex h-[220px] cursor-pointer flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 transition-all duration-300 hover:border-[#AEAC9A] hover:shadow-lg'
                    onClick={() => navigate(`/community/${post.postId}`)}
                  >
                    {/* Post Title */}
                    <div>
                      <h3 className='mb-2 text-lg font-bold text-black'>{post.title}</h3>
                    </div>

                    {/* Author Info */}
                    <div className='mt-auto flex items-center justify-between'>
                      <div className='flex items-center'>
                        <img src={post.imageUrl || 'https://via.placeholder.com/32'} alt='User Profile' className='h-8 w-8 rounded-full object-cover' />
                        <span className='ml-2 text-sm text-gray-700'>{post.nickname}</span>
                      </div>
                      <span className='text-xs text-gray-500'>{isValidDate ? postDate.toLocaleDateString('ko-KR') : '날짜 정보 없음'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>게시글을 불러오는 중입니다...</p>
            )}
          </div>
        </section>

        {/* 로그인 모달 */}
        {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onLogin={() => {}} />}
      </main>
    </div>
  );
};

export default HomePage;
