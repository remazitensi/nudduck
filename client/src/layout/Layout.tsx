/**
 * File Name    : Layout.tsx
 * Description  : 레이아웃
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     레이아웃
 */

import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet을 통해 자식 컴포넌트가 렌더링됨
import Header from './Header'; // 헤더 컴포넌트 경로 설정
import Footer from './Footer'; // 푸터 컴포넌트 경로 설정

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen"> {/* 화면 전체를 차지하는 flex 레이아웃 */}
      <Header /> {/* 모든 페이지에서 공통으로 사용되는 Header */}
      
      <main className="flex-grow"> {/* 메인 컨텐츠, flex-grow로 푸터를 하단에 고정 */}
        <Outlet /> {/* 하위 경로에 따른 컴포넌트 렌더링 */}
      </main>
      
      <Footer /> {/* 모든 페이지에서 공통으로 사용되는 Footer */}
    </div>
  );
};

export default Layout;