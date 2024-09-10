/**
 * File Name    : Header.tsx
 * Description  : layout - 헤더 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.08    김우현      Created     헤더 컴포넌트 생성
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Header: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    if (search.trim() === '') {
      alert('검색어를 입력해 주세요.');
    } else {
      console.log('검색어:', search);
    }
  };

  const navigate = useNavigate();

  const clickHomePage = () => {
    navigate('./HomePage');
  };

  return (
    <header className='flex h-[100px] w-full justify-between border-b border-black'>
      <div className='flex items-center'>
        <div className='ml-[200px] flex items-center'>
          <img src='/LOGO.png' alt='LogoImg' className='mr-[10px] h-[60px] w-[60px]' />
          <img onClick={clickHomePage} src='/logo_image.png' alt='Logo' className='mr-[50px] h-[40px] w-[200px] cursor-pointer' />
        </div>
        <div className='ml-[50px] flex gap-[50px]'>
          <h2 className='cursor-pointer text-[18px] hover:font-bold'>AI 코치</h2>
          <h2 className='cursor-pointer text-[18px] hover:font-bold'>전문가 상담</h2>
          <h2 className='cursor-pointer text-[18px] hover:font-bold'>커뮤니티</h2>
          <h2 className='cursor-pointer text-[18px] hover:font-bold'>인생 그래프</h2>
        </div>
        <div className='ml-[250px] flex items-center gap-[20px] text-[15px]'>
          <input
            className='h-[40px] w-[240px] rounded-xl border border-black p-[10px] focus:outline-none'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='검색어를 입력하세요'
          />
      
          <img src='/chat_image.png' alt='talkImage' className='cursor-pointer' />
          <div className='cursor-pointer'>로그인</div>
          <div className='cursor-pointer'>|</div>
          <div onClick={handleOpenModal} className='cursor-pointer'>
            회원가입
          </div>
          {/* {open && <LoginModal onClose={handleCloseModal} />} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
