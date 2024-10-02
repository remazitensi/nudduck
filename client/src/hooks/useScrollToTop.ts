/**
 * File Name    : ScrollToTop.tsx
 * Description  : 페이지 이동 후 스크롤 최상단
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지       Done       스크롤 최상단으로 이동하는 컴포넌트
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
