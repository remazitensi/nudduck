// MyProfile.tsx
import React from 'react';
import UserEditModal from '../../pages/UserEditModal'

// MyProfile 컴포넌트에 필요한 props 타입 정의
interface MyProfileProps {
  open: boolean;
  image: string;
  nickName: string;
  hashTag: string;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleSaveImage: (newImage: string) => void;
  handleSaveNickName: (newNickName: string) => void;
  handleSaveHashTag: (newHashTag: string) => void;
}

const MyProfile: React.FC<MyProfileProps> = ({
  open,
  image,
  nickName,
  hashTag,
  handleOpenModal,
  handleCloseModal,
  handleSaveImage,
  handleSaveNickName,
  handleSaveHashTag,
}) => {
  return (
    <div>
      <div className='flex flex-col items-center mt-[140px]'>
        <div className='text-[28px] font-bold'>마이페이지</div>
        <div className='mt-[10px] w-[170px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className="flex mt-[80px] w-[1200px] gap-[30px]">
        <div className="w-[500px] h-[780px] bg-[#fafafa] flex flex-col rounded-[20px] shadow-lg">
          <div className="pl-[40px] pt-[35px]">
            <div className="flex gap-[20px]">
              <div className="text-[25px]">내 프로필</div>
              <img onClick={handleOpenModal} className="cursor-pointer" src='edit_button.svg' alt='editButton' />
              {open && (
                <UserEditModal
                  onClose={handleCloseModal}
                  currentImage={image}
                  onSaveImage={handleSaveImage}
                  onSaveNickName={handleSaveNickName}
                  onSaveHashTag={handleSaveHashTag}
                />
              )}
            </div>
            <div className="mt-[25px]">
              <p className="text-[16px]">내 정보를 입력하고 커뮤니티에서 더 많은 유저와 소통해요!</p>
              <div className='mt-[20px] w-[415px] border-b border-[#585858]'></div>
            </div>
          </div>
          <div className="flex justify-center">
            <img className="w-[250px] h-[250px] rounded-[125px] mt-[20px]" src={image} alt='userImg' />
          </div>

          <div className="pl-[65px] mt-[60px]">
            <div className="text-[20px] text-[#909700]">{hashTag}</div>

            <div className="flex gap-[30px] text-[18px]">
              <div className="mt-[20px] leading-loose">
                <div>닉네임</div>
                <div>이름</div>
                <div>이메일</div>
                <div>가입일</div>
              </div>
              <div className="mt-[20px] leading-loose">
                <p>{nickName}</p>
                <p>해찌</p>
                <p>elice@elice.io</p>
                <p>2024-09-08</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
