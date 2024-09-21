/**
 * File Name    : HomePage.tsx
 * Description  : 홈페이지
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     홈페이지 생성
 * 2024.09.21    황솜귤      Modified    홈페이지 레이아웃 구성
 */

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="mx-auto max-w-6xl p-4">
        {/* Today's Quote */}
        <section className="my-6 rounded bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-gray-700">오늘의 명언</h2>
          <p className="mt-2 text-gray-600">
            붙잡을 가치가 있는 것이었다면 놓지 않았을 것이라는 사실을 꼭 기억하세요.
          </p>
        </section>

        {/* AI Coach Section */}
        <section className="my-6 flex items-center justify-between rounded bg-blue-100 p-6 shadow">
          <img src="/path-to-images/ai-image1.png" alt="AI Coach" className="h-48" />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-blue-700">AI Coach</h3>
            <p className="mt-2 text-gray-700">
              누떡에서 제공하는 AI 서비스는 사용자가 면접 준비를 효율적으로 할 수 있도록 돕는
              혁신적인 도구입니다.
            </p>
            <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">Learn More</button>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="my-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded bg-white p-6 shadow">
            <img src="/path-to-images/ai-image2.png" alt="Feature 1" className="mx-auto h-32" />
            <h3 className="mt-4 text-center text-lg font-bold">Expert Consulting</h3>
            <p className="mt-2 text-center text-gray-600">
              각 분야 전문가와의 1:1 상담을 받아보세요.
            </p>
          </div>
          <div className="rounded bg-white p-6 shadow">
            <img src="/path-to-images/ai-image3.png" alt="Feature 2" className="mx-auto h-32" />
            <h3 className="mt-4 text-center text-lg font-bold">Community</h3>
            <p className="mt-2 text-center text-gray-600">
              게시판을 통해 유저들과 정보를 나누세요.
            </p>
          </div>
          <div className="rounded bg-white p-6 shadow">
            <img src="/path-to-images/ai-image4.png" alt="Feature 3" className="mx-auto h-32" />
            <h3 className="mt-4 text-center text-lg font-bold">Life Graph</h3>
            <p className="mt-2 text-center text-gray-600">인생의 다양한 그래프를 만들어보세요.</p>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="my-6 rounded bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-gray-700">지금 뜨는 게시글</h2>
          <div className="mt-4 space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="rounded border border-gray-200 p-4 shadow-sm">
                <h3 className="font-bold">제목이 들어갈 자리입니다</h3>
                <p className="mt-2 text-gray-600">
                  내용이 들어갈 자리입니다 내용이 들어갈 자리입니다 내용이 들어갈 자리입니다 내용이
                  들어갈 자리입니다.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">작성자 닉네임</span>
                  <span className="text-sm text-gray-500">2024-09-06</span>
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
