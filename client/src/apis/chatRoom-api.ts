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
    if (response.status === 200) {
      console.log('invite chat:', response.data);
      return response.data;
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to inviteChat:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 채팅 목록 조희 get api 사용자의 채팅 목록을 확인하고, 특정 대화방의 메시지를 불러오는데 필요, 대화방에 들어갈 때 호출됨
export async function checkChat(recipientId: number) {
  const url = `${api.chat}/rooms/${recipientId}`;

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
export async function whichCheckchatRoom(roomId: number) {
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
export async function sendMessage(loggedInUserId: number, loggedInUserNickname: string, roomId: number, message: string) {
  const url = `${api.chat}/rooms/${roomId}/send`;

  try {
    const response = await baseApi.post(url, { loggedInUserId, loggedInUserNickname, message });
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

// // api 1:1채팅하기 클릭 시 불러오는 것 get, start-chat 등 동시 요청 get부분의 api 채팅 히스토리를 가져오는건데 필요없지 않을까?
// export async function fetchChatHistory() {
//   const url = `${api.chat}`;

//   try {
//     const response = await baseApi.get(url);
//     if (response.status === 200) {
//       console.log('chat history:', response.data);
//     }
//     return response;
//   } catch (error: unknown) {
//     if (isAxiosError(error)) {
//       console.error('Failed to fetch chat history:', error.response?.data?.message || error.message);
//     } else {
//       console.error('An unknown error occurred');
//     }
//     throw error;
//   }
// }

// // api 1:1채팅하기 클릭 시 불러오는 것 get, start-chat 등 동시 요청 post부분의 api 이 부분을 필요할 것 같다 채팅창 보내서 1:1대화 목록
// // 부분과 전송버튼을 눌렀을 때 post로 전송하여 백엔드와 연결하여 작동되는게 아닌가?
// export async function activateChat() {
//   const url = `${api.chat}/send`;

//   try {
//     const response = await baseApi.post(url);
//     response.status === 200;
//     console.log('chat activation:', response.data);
//   } catch (error: unknown) {
//     if (isAxiosError(error)) {
//       console.error('Failed to chat Activation:', error.response?.data?.message || error.message);
//     } else {
//       console.error('An unknown error occurred');
//     }
//     throw error;
//   }
// }
// 와이어 프레임ㅇㄹ 보면 1:1대화 목록, 전송버튼 누를 때 빼고는 api사용이 없는 것 같다.
// AI와 다르게 어떠한 데이터를 가지고 하는 것이 아니기에, 전송버튼 post가 결국은 1:1채팅 목록이니 같은 api를 사용해서
// 백엔드와 연동하게끔 api를 이용하면 api는 끝이지 않을까 싶다

// api 1:1채팅하기 불러오는 api get,post 둘다 사용안해도 되는게 아닌지?
