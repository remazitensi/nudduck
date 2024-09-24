/**
 * File Name    : Header.tsx
 * Description  : pages - 프로필 수정 모달 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     프로필 수정 모달 생성
 * 2024.09.11    김우현      Updated     모달 창 고도화()
 * 2024.09.20    김우현      Updated     api 완성()
 */

import React, { useEffect, useRef, useState } from 'react';
import { baseApi } from '../apis/base-api';
import { updateUserProfile } from '../apis/mypage-api';

interface UserEditModalProps {
  data: {
    id: string;
    nickname: string;
    imageUrl: string;
    name: string;
    email: string;
    hashtags: string[];
    createdAt: string;
  };
  onClose: () => void;
  currentImage: string;
  onSaveImage: (newImage: string) => void;
  onSaveNickname: (newNickname: string) => void;
  onSaveHashTag: (newHashTag: string[]) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ data, onClose, currentImage, onSaveImage, onSaveNickname, onSaveHashTag }) => {
  const [image, setImage] = useState<string>(currentImage);
  const [nickname, setNickname] = useState<string>(data.nickname || '');
  const [hashTag, setHashTag] = useState<string>(data.hashtags.join(' ') || '');
  const [nicknameError, setNicknameError] = useState<string>('');
  const [hashTagError, setHashTagError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setNickname(data.nickname || '');
    setHashTag(data.hashtags.join(' ') || '');
    setImage(data.imageUrl || '');
  }, [data]);

  // 닉네임 유효성 검사
  const validationNickname = (value: string): string | null => {
    const trimValue = value.trim();
    const isValid = /^[가-힣a-zA-Z0-9]{2,6}$/.test(trimValue);
    if (!isValid) {
      return '닉네임은 공백 없이 2~6자의 한글, 영문, 숫자만 사용 가능합니다.';
    }
    return null;
  };

  // 해시태그 유효성 검사
  const validationHashTag = (value: string): string | null => {
    const tags = value.split(' ').filter((tag) => tag !== '');
    const isValidTags = tags.every((tag) => tag.startsWith('#') && tag.length >= 2 && tag.length <= 6);
    if (tags.length > 5 || !isValidTags) {
      return '해시태그는 최대 5개까지, 각 항목은 2~6자이며 #이 포함되어야 합니다.';
    }
    return null;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    const error = validationNickname(value);
    setNicknameError(error || '');
  };

  const handleHashTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHashTag(value);
    const error = validationHashTag(value);
    setHashTagError(error || '');
  };

  const handleClickImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImage(reader.result as string); // 이미지 미리보기 설정
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제 시 기본 이미지 설정
  const deleteFileImg = () => {
    setImage('/default_user_image.png'); // 기본 이미지 경로 설정
  };

  // 프로필 저장 처리
  const handleSave = async () => {
    if (nicknameError || hashTagError) {
      alert('유효성 검사가 완료되지 않았습니다.');
      return;
    }

    onSaveImage(image); // 이미지 저장
    onSaveNickname(nickname); // 닉네임 저장

    // 해시태그를 공백을 기준으로 분리하여 배열로 변환
    const hashTagsArray = hashTag.split(' ').filter((tag) => tag.trim() !== ''); // 빈 문자열 제거

    onSaveHashTag(hashTagsArray); // 해시태그 저장

    // API 호출 로직
    const updateProfile = async () => {
      try {
        let imageUrl = image; // image 상태 값을 그대로 사용

        // 이미지 업로드 처리
        if (imageUrl && fileInputRef.current?.files && fileInputRef.current.files[0]) {
          const file = fileInputRef.current.files[0];
          const fileType = file.type;

          // Presigned URL 요청
          const { data } = await baseApi.post('/presigned-url', {
            fileName: file.name,
            contentType: fileType,
          });

          // 파일을 presigned URL을 사용하여 업로드
          await fetch(data.presignedURL, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': fileType,
            },
          });

          imageUrl = data.presignedURL.split('?')[0]; // 업로드된 이미지 URL
        }

        const profileData = { imageUrl, hashtags: hashTagsArray, nickname };
        await updateUserProfile(profileData);

        alert('프로필이 성공적으로 수정되었습니다.');

        // 업데이트된 데이터를 상위 컴포넌트로 전달
        onSaveImage(imageUrl);
        onSaveNickname(nickname);
        onSaveHashTag(hashTagsArray);

        onClose();
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('프로필 업데이트 중 오류가 발생했습니다.');
      }
    };

    await updateProfile();
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#585858] bg-opacity-30' onClick={onClose}>
      <div className='flex h-[750px] w-[900px] flex-col rounded-xl bg-white shadow-lg' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-end'>
          <div onClick={onClose} className='flex cursor-pointer p-[20px] text-[24px]'>
            x
          </div>
        </div>
        <div className='flex items-start'>
          <div className='relative flex flex-col justify-start pl-[80px] pt-[50px]'>
            <div className='text-center text-[34px] font-bold text-[#626146]'>프로필 편집</div>
            <img src={image} alt='userImg' className='mt-[10px] h-[200px] w-[200px] rounded-[100px]' />
            <img onClick={() => fileInputRef.current?.click()} className='absolute bottom-[35px] right-[50px] h-[50px] w-[50px] cursor-pointer' src='/Camera.png' alt='cameraImg' />
            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleClickImg} />
            <div onClick={deleteFileImg} className='flex cursor-pointer justify-center text-[13px] text-[#999999]'>
              이미지 삭제
            </div>
          </div>

          <div className='flex w-[600px] flex-col pl-[80px] pt-[130px]'>
            <div className='mb-[10px] flex gap-[10px]'>
              <input className='h-[40px] w-[300px] cursor-not-allowed rounded border bg-gray-100 pl-[20px] outline-none' placeholder={data.name || '이름'} readOnly />
              <div className='flex items-center text-[16px] text-[#8D8B67]'>※ 이름 수정 불가</div>
            </div>
            <div className='mb-[10px] flex gap-[10px]'>
              <input className='h-[40px] w-[300px] cursor-not-allowed rounded border bg-gray-100 pl-[20px] outline-none' placeholder={data.email || '이메일'} readOnly />
              <div className='flex items-center text-[16px] text-[#8D8B67]'>※ 이메일 수정 불가</div>
            </div>

            <div className='mb-[10px] flex flex-col gap-[10px]'>
              <input value={nickname} onChange={handleNicknameChange} className='h-[40px] w-[300px] rounded border pl-[20px] outline-[#8D8B67]' placeholder='닉네임' />
              {nicknameError && <p className='text-[13px] text-red-500'>{nicknameError}</p>}
              <div className='text-[#8D8B67]'>
                닉네임은 다른 유저에게 보이는 이름이에요!
                <br />
                2~6자리로 설정해 주세요.
              </div>
            </div>

            <div className='mb-[10px] flex flex-col gap-[10px]'>
              <div className='flex'>
                <input value={hashTag} onChange={handleHashTagChange} className='h-[40px] w-[300px] rounded border pl-[20px] outline-[#8D8B67]' placeholder='각 태그는 2~6자로 설정해주세요.' />
                <div className='flex items-center text-[16px] text-[#8D8B67]'>※ 최대 5개</div>
              </div>
              {hashTagError && <p className='text-[13px] text-red-500'>{hashTagError}</p>}
              <div className='text-[#8D8B67]'>
                자신을 표현하는 해시태그는 띄어쓰기(공백)으로 구분해 주세요!
                <br />
                예) #IT #기획 #스타트업
              </div>
            </div>

            <div className='mt-[60px] flex gap-[10px]'>
              <button onClick={onClose} className='h-[50px] w-[160px] rounded border bg-[#F8F8F8] text-[#8D8B67]'>
                취소
              </button>
              <button onClick={handleSave} className='h-[50px] w-[160px] rounded border bg-[#8D8B67] text-white'>
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
