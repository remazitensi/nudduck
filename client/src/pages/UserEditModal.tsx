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
    nickName: string;
    imageUrl: string;
    name: string;
    email: string;
    hashtags: string;
    created_At: string;
  };
  onClose: () => void;
  currentImage: string;
  onSaveImage: (newImage: string) => void;
  onSaveNickName: (newNickName: string) => void;
  onSaveHashTag: (newHashTag: string) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ data, onClose, currentImage, onSaveImage, onSaveNickName, onSaveHashTag }) => {
  const [image, setImage] = useState<string>(currentImage);
  const [nickName, setNickName] = useState<string>(data.nickName || '');
  const [hashTag, setHashTag] = useState<string>(data.hashtags || '');
  const [nickNameError, setNickNameError] = useState<string>('');
  const [hashTagError, setHashTagError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setNickName(data.nickName || '');
    setHashTag(data.hashtags || '');
    setImage(data.imageUrl || '');
  }, [data]);

  const validationNickName = (value: string): string | null => {
    const trimValue = value.trim();
    const isValid = /^[가-힣a-zA-Z0-9]{2,6}$/.test(trimValue);

    if (!isValid) {
      return '닉네임은 공백 없이 2~6자의 한글, 영문, 숫자만 사용 가능합니다.';
    }
    return null;
  };

  const validationHashTag = (value: string): string | null => {
    const tags = value.split(' ').filter((tag) => tag !== '');
    const isValidTags = tags.every((tag) => tag.startsWith('#') && tag.length >= 2 && tag.length <= 6);
    if (tags.length > 5 || !isValidTags) {
      return '해시태그는 최대 5개까지, 각 항목은 2~6자이며 #이 포함되어야 합니다.';
    }
    return null;
  };

  const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickName(value);
    const error = validationNickName(value);
    setNickNameError(error || '');
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
          setImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteFileImg = () => {
    setImage('/user_image.png');
  };

  const handleSave = async () => {
    if (nickNameError || hashTagError) {
      alert('유효성 검사가 완료되지 않았습니다.');
      return;
    }
    console.log('Saving image:', image);
    onSaveImage(image);
    console.log('Saving nickname:', nickName);
    onSaveNickName(nickName);
    console.log('Saving hashtag:', hashTag);
    onSaveHashTag(hashTag);
    // 수정 api
    const updateProfile = async () => {
      try {
        const hashTagsArray = hashTag.split(' '); //.map(tag => tag.trim());
        // image 기본이면 빈 문자열 보내기
        let imageUrl = image === '/user.png' ? '' : image; // 기본 이미지 처리

        if (imageUrl) {
          // 빈문자열이 아닐때만 실행
          // 파일이 Blob 또는 File 객체일 경우
          const fileType = image instanceof File ? image.type : 'image/jpeg'; // 기본적으로 JPEG로 설정

          // 1) presigned URL 요청
          const { data } = await baseApi.post('/presigned-url', {
            fileName: imageUrl,
            fileType: fileType,
          });

          // 2) presigned URL로 S3에 파일 업로드
          await axios.put(presignedUrl, image, {
            headers: {
              'Content-Type': image,
            },
          });

          imageUrl = data.presignedUrl.split('?')[0];
        }

        const profile = { imageUrl: imageUrl, hashtags: hashTagsArray, nickname: nickName };
        // const data: typeof profile = await updateUserProfile(profile); // body에 보내줄 객체
        await updateUserProfile(profile, imageUrl);

        console.log('Fetched profile:', data); // API 호출 후 데이터 로그 확인
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    updateProfile();
    alert('저장되었습니다.');
    onClose();
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
            <img onClick={() => fileInputRef.current?.click()} className='absolute bottom-[35px] right-[15px] right-[50px] h-[50px] w-[50px] cursor-pointer' src='/Camera.png' alt='cameraImg' />

            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleClickImg} />

            <div onClick={deleteFileImg} className='flex cursor-pointer justify-center text-[13px] text-[#999999]'>
              이미지 삭제
            </div>
          </div>
          <div className='flex w-[600px] flex-col pl-[80px] pt-[130px]'>
            <div className='mb-[10px] flex gap-[10px]'>
              <input className='h-[40px] w-[300px] cursor-not-allowed rounded border bg-gray-100 pl-[20px] outline-none' placeholder='해찌' readOnly />
              <div className='flex items-center text-[16px] text-[#8D8B67]'>※ 이름 수정 불가</div>
            </div>

            <div className='mb-[10px] flex gap-[10px]'>
              <input className='h-[40px] w-[300px] cursor-not-allowed rounded border bg-gray-100 pl-[20px] outline-none' placeholder='elice@elice.io' readOnly />
              <div className='flex items-center text-[16px] text-[#8D8B67]'>※ 이메일 수정 불가</div>
            </div>

            <div className='mb-[10px] flex flex-col gap-[10px]'>
              <input value={nickName} onChange={handleNickNameChange} className='h-[40px] w-[300px] rounded border pl-[20px] outline-[#8D8B67]' placeholder='닉네임' />
              {nickNameError && <p className='text-[13px] text-red-500'>{nickNameError}</p>}
              <div className='text-[#8D8B67]'>
                닉네임은 다른 유저에게 보이는 이름이에요!
                <br />
                2~6자리로 설정해 주세요.
              </div>
            </div>

            <div className='mb-[10px] flex flex-col gap-[10px]'>
              <div className='flex flex-col gap-[10px]'>
                <div className='flex'>
                  <input value={hashTag} onChange={handleHashTagChange} className='h-[40px] w-[300px] rounded border pl-[20px] outline-[#8D8B67]' placeholder='각 태그는 1~5자로 설정해주세요.' />
                  <div className='flex items-center text-[16px] text-[#8D8B67]'>※ 최대 5개</div>
                </div>
                {hashTagError && <p className='text-[13px] text-red-500'>{hashTagError}</p>}
              </div>
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
