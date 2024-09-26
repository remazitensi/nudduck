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
 */

import { useEffect, useState } from 'react';
import { baseApi } from '../apis/base-api'; // baseApi 임포트
import LoginModal from '../components/LoginModal';
import './HomePage.css';

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  views: number;
  author: {
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

// 명언 타입 정의
interface Quote {
  id: number;
  author: string;
  message: string;
}

// 영문장 타입 정의
interface EnglishSentence {
  id: number;
  english: string;
  korean: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [englishSentence, setEnglishSentence] = useState<EnglishSentence | null>(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true); // 명언 또는 영문장 표시 여부
  const [hoverText, setHoverText] = useState<string | null>(null); // 호버 시 표시할 텍스트
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // 마우스 위치
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 모달 상태 관리

  const openLoginModal = () => {
    setIsLoginModalOpen(true); // 모달 열기
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false); // 모달 닫기
  };

  // 명언 및 영문장 데이터 가져오기
  useEffect(() => {
    const fetchQuotesAndSentences = async () => {
      try {
        const response = await baseApi.get('/api/schedule/quotes-and-sentences');
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

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await baseApi.get('/community', {
          params: {
            sort: 'popular',
            pageNo: 1,
          },
        });

        if (response.status === 200 && response.data.posts) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error('인기 게시글을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div className="bg-white-100 min-h-screen">
      <main className="mx-auto max-w-6xl p-4">
        {/* Today's Quote Section */}
        <section className="my-6 flex justify-center">
          <div
            className="relative h-[81px] w-[994px]"
            onClick={toggleQuoteAndSentence}
            onMouseEnter={() =>
              setHoverText(
                isQuoteVisible ? '오늘의 영문장으로 전환하기!' : '오늘의 명언으로 전환하기!',
              )
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverText(null)}
          >
            <div className="absolute left-0 top-[6px] h-[70px] w-[994px] rounded-[5px] border border-[#313119] bg-white" />
            <div className="fontsize-22px absolute left-[31px] top-[22px] h-[29px] w-[175px] text-center font-['Pretendard'] text-3xl font-semibold text-[#909700]">
              {isQuoteVisible ? '오늘의 명언' : '오늘의 영문장'}
            </div>
            <div className="absolute left-[222px] top-[29px] text-center font-['Pretendard'] text-xl font-normal text-[#313119]">
              {isQuoteVisible && quote ? (
                <>{quote.message}</>
              ) : (
                englishSentence && (
                  <>
                    {englishSentence.korean} <br /> ({englishSentence.english})
                  </>
                )
              )}
            </div>
            {/* 호버 시 나타나는 텍스트 */}
            {hoverText && (
              <div
                style={{
                  position: 'fixed',
                  left: mousePosition.x + 10, // 마우스 커서 위치에서 약간 오른쪽에 표시
                  top: mousePosition.y + 10, // 마우스 커서 위치에서 약간 아래쪽에 표시
                  padding: '2px 6px', // 약간의 패딩 추가
                  pointerEvents: 'none', // 이 요소 자체에 마우스 이벤트가 적용되지 않도록 설정
                }}
                className="animate-bounce text-sm text-[#AEAC9A]" // Tailwind CSS를 사용한 스타일링
              >
                {hoverText}
              </div>
            )}
          </div>
        </section>

        {/* AI Coach Section */}
        <section className="my-6 flex items-center justify-between rounded bg-white p-6">
          <img src="ai-image1.png" alt="AI Coach" className="h-[600px] w-[500px]" />
          <div className="ml-4 flex flex-col">
            <div className="relative rounded-[10px] bg-[#A1DFFF] p-[20px] shadow-xl">
              <h3 className="text-xl font-bold text-blue-700">AI Coach</h3>
              <p className="mt-2 text-[18px] text-gray-700">
                <span className="font-bold">누떡</span>에서 제공하는 AI 서비스는 사용자가 면접
                준비를 효율적으로 할 수 있도록 돕는 혁신적인 도구입니다.
              </p>
              {/* 말풍선 꼬리 추가 */}
              <div className="absolute -left-14 top-10 h-0 w-0 border-[30px] border-transparent border-r-[#A1DFFF]"></div>
            </div>
            <p className="m-auto mt-[95px] text-center text-[24px] font-bold">
              구글, 카카오 아이디가 있으신가요?
              <br />
              <span
                onClick={openLoginModal} // 클릭 시 모달 열기
                className="cursor-pointer bg-none text-[#909700]"
              >
                로그인
              </span>
              하고 하단 메뉴를 이용해 보세요.
            </p>
          </div>
        </section>

        {/* Feature Cards Section - 로그인 전 상태 */}
        <section className="my-6">
          <h2 className="text-xl font-bold">로그인하고 내 조건에 맞는 서비스 이용하기</h2>
          {/* grid-cols-3 을 4로 변경*/}
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  프로필 채우고 나에게 딱 맞는
                </h3>
                <h2 className="text-xl font-bold text-black">
                  AI 가상 면접과 실전 면접 시나리오를 확인해 보세요!
                </h2>
              </div>
              <button className="mt-4 w-full rounded bg-[#909700] py-2 text-white">
                프로필 입력하기
              </button>
            </div>

            <div className="flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow">
              <img src="ai-image2.png" alt="Expert Consulting" className="h-24" />
              <h3 className="mt-4 text-center text-lg font-bold">Expert Consulting</h3>
              <p className="mt-2 text-center text-gray-600">
                각 분야 전문가의 프로필을 확인하고 1:1 맞춤 상담을 받아 보세요
              </p>
            </div>

            <div className="flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow">
              <img src="ai-image3.png" alt="Community" className="h-24" />
              <h3 className="mt-4 text-center text-lg font-bold">Community</h3>
              <p className="mt-2 text-center text-gray-600">
                게시판과 채팅방을 통해 누떡 유저들과 커뮤니티를 형성하세요
              </p>
            </div>

            <div className="flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow">
              <img src="ai-image4.png" alt="Life Graph" className="h-24" />
              <h3 className="mt-4 text-center text-lg font-bold">Life Graph</h3>
              <p className="mt-2 text-center text-gray-600">
                인생의 여러 가지 사건들을 그래프로 만들어 보세요
              </p>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="my-6 rounded bg-white">
          <h2 className="text-xl font-bold">지금 뜨는 게시글</h2>
          <div className="mt-4 space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded border border-gray-200 p-4 shadow-sm">
                <h3 className="font-bold">{post.title}</h3>
                <p className="mt-2 text-gray-600">조회수: {post.views}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={post.author.profileImage || 'https://via.placeholder.com/32'}
                      alt="User Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-2 text-sm text-gray-500">{post.author.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
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
