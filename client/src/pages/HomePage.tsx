/**
 * File Name    : HomePage.tsx
 * Description  : 홈페이지
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     홈페이지 생성
 * 2024.09.21    황솜귤      Modified    홈페이지 레이아웃 구성
 * 2024.09.22    황솜귤      Modified    스타일 시트 수정
 */

import { useEffect, useState } from 'react';
import { baseApi } from '../apis/base-api'; // baseApi 임포트
import './HomePage.css'; // 필요한 스타일을 위한 css 파일

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

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [quote, setQuote] = useState('');

  const quotes = [
    '불잡을 가치가 있는 것이었다면 놓지 않았을 것이라는 사실을 꼭 기억하세요.',
    '성공은 노력의 결과입니다.',
    '시작이 반입니다.',
    '도전하지 않으면 아무것도 얻을 수 없습니다.',
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    const randomQuote = getRandomQuote();
    setQuote(randomQuote);
  }, []);

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
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-6xl p-4">
        {/* Today's Quote */}
        <section className="my-6 rounded bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-[#909700]">오늘의 명언</h2>
          <p className="mt-2 text-gray-600">{quote}</p>
        </section>

        {/* AI Coach Section */}
        <section className="my-6 flex items-center justify-between rounded bg-blue-100 p-6 shadow">
          <img src="ai-image1.png" alt="AI Coach" className="h-48" />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-blue-700">AI Coach</h3>
            <p className="mt-2 text-gray-700">
              누떡에서 제공하는 AI 서비스는 사용자가 면접 준비를 효율적으로 할 수 있도록 돕는
              혁신적인 도구입니다.
            </p>
          </div>
        </section>

        {/* Feature Cards Section - 로그인 전 상태 */}
        <section className="my-6">
          <h2 className="text-xl font-bold">로그인하고 내 조건에 맞는 서비스 이용하기</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                각 분야 전문가의 프로필을 확인하고 1:1 맞춤 상담을 받아보세요.
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
        <section className="my-6 rounded bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-gray-700">지금 뜨는 게시글</h2>
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
      </main>
    </div>
  );
};

export default HomePage;
