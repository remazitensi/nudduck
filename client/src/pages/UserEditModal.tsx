/**
 * File Name    : Header.tsx
 * Description  : pages - 프로필 수정 모달 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     프로필 수정 모달 생성
 * 2024.09.11    김우현      Updated     모달 창 고도화()
 */

import React, { useState, useRef } from 'react';

interface UserEditModalProps {
    onClose: () => void;
    currentImage: string; // 현재 이미지 경로
    onSaveImage: (newImage: string) => void; // 저장버튼 클릭시 호출되는 함수 이미지 저장 함수
    onSaveNickName: (newNickName: string) => void; // 닉네임 저장 함수
    onSaveHashTag: (newHashTag: string) => void; // 해시테그 저장 함수
}

const UserEditModal: React.FC<UserEditModalProps> = ({ onClose, currentImage, onSaveImage, onSaveHashTag, onSaveNickName }) => {
    const [image, setImage] = useState(currentImage); // 초기 이미지 설정
    const [nickName, setNickName] = useState('');
    const [hashTag, setHashTag] = useState('');
    const [nickNameError, setNickNameError] = useState('');
    const [hashTagError, setHashTagError] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const validationNickName = (value: string): string | null => {
        const trimValue = value.trim();
        const isValid = /^[가-힣a-zA-Z0-9]{2,6}$/.test(trimValue);

        if (!isValid) {
            return '닉네임은 공백 없이 2~6자의 한글, 영문, 숫자만 사용 가능합니다.';
        }
        return null;
    }

    const validationHashTag = (value: string): string | null => {
        const tags = value.split(' ').filter(tag => tag !== '');
        const isValidTags = tags.every(tag => tag.startsWith('#') && tag.length >= 2 && tag.length <= 6);
        if (tags.length > 5 || !isValidTags) {
            return '해시태그는 최대 5개까지, 각 항목은 2~6자이며 #이 포함되어야 합니다.';
        }
        return null;
    }

    const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNickName(value);
        const error = validationNickName(value);
        setNickNameError(error || '');
    }

    const handleHashTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHashTag(value);
        const error = validationHashTag(value);
        setHashTagError(error || '');
    }

    const handleClickImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return; // 파일이 없으면 중지
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImage(reader.result as string);  // 이미지 상태 업데이트
                }
            }
            reader.readAsDataURL(file); // 파일을 Base64로 읽기
        }
    }

    // 이미지 삭제하는 함수
    const deleteFileImg = () => {
        setImage('/user_image.png');
    }

    // 부모 컴포넌트에 이미지 전달
    const handleSave = () => {
        if (nickNameError || hashTagError) {
            alert('유효성 검사가 완료되지 않았습니다.'); // 오류 메시지 표시
            return;
        }
        onSaveImage(image); 
        onSaveNickName(nickName);
        onSaveHashTag(hashTag);
        alert('저장되었습니다.');
        onClose(); // 모달닫기
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#585858] bg-opacity-30" onClick={onClose}>
            <div className="flex flex-col w-[900px] h-[750px] rounded-xl bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                    <div onClick={onClose} className='flex p-[20px] text-[24px] cursor-pointer'>
                        x
                    </div>
                </div>
                <div className='flex items-start'>
                    <div className='relative flex flex-col pl-[80px] pt-[50px] justify-start'>
                        <div className='text-[#626146] text-[34px] font-bold text-center'>프로필 편집</div>
                        <img src={image} alt="userImg" className='w-[200px] h-[200px] mt-[10px] rounded-[100px]' />
                        <img onClick={() => fileInputRef.current?.click()} // 카메라 이미지를 클릭하면 파일 선택 창 열기
                        className='absolute bottom-[35px] right-[15px] right-[50px] w-[50px] h-[50px] cursor-pointer' 
                        src='/Camera.png' alt="cameraImg" />

                        {/* 숨겨진 파일 입력 요소 */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden" // 숨김 처리
                            onChange={handleClickImg} // 파일 선택 시 처리 함수 호출
                        />

                        <div onClick={deleteFileImg} className='flex justify-center text-[13px] text-[#999999] cursor-pointer'>이미지 삭제</div>
                    </div>
                    <div className='flex flex-col w-[600px] pl-[80px] pt-[130px]'>
                        <div className='flex gap-[10px] mb-[10px]'>
                            <input className='pl-[20px] w-[300px] h-[40px] bg-gray-100 rounded border cursor-not-allowed outline-none' placeholder='해찌' readOnly />
                            <div className='text-[#8D8B67] text-[16px] flex items-center'>※ 이름 수정 불가</div>
                        </div>

                        <div className='flex gap-[10px] mb-[10px]'>
                            <input className='pl-[20px] w-[300px] h-[40px] bg-gray-100 rounded border cursor-not-allowed outline-none' placeholder='elice@elice.io' readOnly />
                            <div className='text-[#8D8B67] text-[16px] flex items-center'>※ 이메일 수정 불가</div>
                        </div>

                        <div className='flex flex-col gap-[10px] mb-[10px]'>
                            <input
                                value={nickName}
                                onChange={handleNickNameChange}
                                className='pl-[20px] w-[300px] h-[40px] rounded border outline-[#8D8B67]' placeholder='닉네임'/>
                            {nickNameError && <p className='text-red-500 text-[13px]'>{nickNameError}</p>}
                            <div className='text-[#8D8B67]'>닉네임은 다른 유저에게 보이는 이름이에요!<br/>2~6자리로 설정해 주세요.</div>
                        </div>

                        <div className='flex flex-col gap-[10px] mb-[10px]'>
                            <div className='flex flex-col gap-[10px]'>
                                <div className='flex'>
                                    <input 
                                        value={hashTag}
                                        onChange={handleHashTagChange}
                                        className='pl-[20px] w-[300px] h-[40px] rounded border outline-[#8D8B67]' placeholder='각 태그는 1~5자로 설정해주세요.'/>
                                    <div className='flex text-[#8D8B67] text-[16px] flex items-center'>※ 최대 5개</div>
                                </div>
                                {hashTagError && <p className='text-red-500 text-[13px]'>{hashTagError}</p>}
                            </div>
                            <div className='text-[#8D8B67]'>자신을 표현하는 해시태그는 띄어쓰기(공백)으로 구분해 주세요!<br/>예) #IT #기획 #스타트업</div>
                        </div>

                        <div className='flex gap-[10px] mt-[60px]'>
                            <button onClick={onClose} className='w-[160px] h-[50px] border rounded-xl text-[#8D8B67] font-bold'>취소하기</button>
                            <button onClick={handleSave} className='w-[160px] h-[50px] border rounded-xl bg-[#909700] text-white font-bold'>저장하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserEditModal;
