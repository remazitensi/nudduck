const NotFound: React.FC = () => {
  const goBack = () => {
    window.history.back();
  };
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <img src='/404_image.png' alt='404 error message' className='h-auto w-[500px]' />
      <p className='mt-10 text-3xl'> 404 Not Found</p>
      <p>요청한 페이지를 찾을 수 없습니다.</p>
      <button onClick={goBack} className='mt-10 rounded-lg border border-[#909700] px-6 py-3 text-[#909700] hover:bg-[#C7C4A7]'>
        이전 화면으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
