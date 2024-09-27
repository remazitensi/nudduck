/**
 * File Name    : chatRoom-api.ts
 * Description  : pages - 프로필 수정 모달 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김우현      Updated     api 완성()
 */

import { isAxiosError } from 'axios';
import { api, baseApi } from './base-api';

// 대화 신청: post /api/chat/rooms
// 채팅 목록 조회: get /api/chat/rooms
// 특정 채팅방의 메시지 조회: get /api/chat/rooms/:roomId/messages

// 대화 신청 post api 새로운 채팅방을 생성하고 사용자를 초대하는 기능이 필요, 사용자가 대화를 시작할 떄 호출됨
export async function inviteChat(loggedInUserId: number, recipientId: number, loggedInUserNickname: string, recipientNickname: string) {
  const url = `${api.chat}/rooms`;

  try {
    const response = await baseApi.post(url, {
      participants: [loggedInUserId, recipientId],
      chatroomName: `${loggedInUserNickname}과 ${recipientNickname}의 채팅방`,
    });

    // 응답 데이터를 로그로 확인
    console.log('inviteChat response data:', response.data);

    if (response.status === 200) {
      console.log('invite chat:', response.data);
      return response.data;
    } else {
      console.error('Unexpected response status:', response.status);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to inviteChat:', error.response?.data?.message || error.message);
      console.error('Full error response:', error.response);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 대화 신청 더미 데이터를 사용하는 inviteChat 함수
// export async function inviteChat(loggedInUserId: number, recipientId: number, loggedInUserNickname: string, recipientNickname: string) {
//   // 더미 데이터 생성
//   const dummyResponse = {
//     roomData: {
//       roomId: 'dummyRoomId', // 더미 roomId
//       participants: [loggedInUserId, recipientId],
//       messages: [
//         { name: loggedInUserNickname, msg: "안녕하세요", time: new Date().toLocaleTimeString() }
//       ]
//     }
//   };
// // 더미 데이터를 반환 (실제 API 호출을 대신함)
// console.log('inviteChat response data:', dummyResponse);
// return dummyResponse; // 실제 서버 응답처럼 처리
// }

// 채팅 목록 조희 get api 사용자의 채팅 목록을 확인하고, 특정 대화방의 메시지를 불러오는데 필요, 대화방에 들어갈 때 호출됨
export async function checkChat(recipientId: number) {
  const url = `${api.chat}/rooms/${recipientId}`; // recipientId는 상대방을 고유하게 식별하는 값으로, 1:1 채팅의 목록에서 해당 상대방과의 대화방을 식별하는 중요한 역할

  try {
    const response = await baseApi.get(url);
    if (response.status === 200) {
      console.log('check Chat:', response.data);
    }
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to checkChat:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 특정 채팅방의 메시지 조회: get /api/chat/rooms/:roomId/messages 특정 대화방의 메시지를 조회하기 위해 필요, 사용자가 이전 대화를 확인할 때 이 함수를 사용
export async function whichCheckchatRoom(roomId: string) {
  const url = `${api.chat}/rooms/${roomId}/messages`;

  try {
    const response = await baseApi.get(url);
    if (response.status === 200) {
      console.log('which chatRoom:', response.data);
    }
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to chatRoom:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 채팅방에 메시지 전송 사용자가 메시지를 보낼 때, 그 메시지를 서버에 저장하기 위한 api호출 소켓을 통해 실시간으로 전송하는 것과 별개로, 메시지를 저장하기 위해 필요
export async function sendMessage(loggedInUserId: number, roomId: string, message: string) {
  // roomId를 사용하여 URL 설정

  const url = `${api.chat}/rooms/${roomId}/send`;
  console.log(url);
  try {
    const response = await baseApi.post(url, {
      content: message,
      sendId: loggedInUserId,
    });
    if (response.status === 200) {
      console.log('send Message:', response.data);
    }
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to sendMessage:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 더미 메시지 전송 sendMessage 함수
// export async function sendMessage(loggedInUserId: number, loggedInUserNickname: string, roomId: string, message: string) {
//   if (!roomId) {
//     throw new Error('Room ID is required');
//   }

//   // 더미 응답 생성
//   const dummyResponse = {
//     status: 200,
//     data: {
//       roomId,
//       message: {
//         senderId: loggedInUserId,
//         senderNickname: loggedInUserNickname,
//         content: message,
//         time: new Date().toLocaleTimeString(),
//       },
//     },
//   };
//   // 더미 데이터 출력
//   console.log('send Message dummy:', dummyResponse.data);
//   return dummyResponse.data;
// }
