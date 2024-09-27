import { io, Socket as SocketIOClient } from 'socket.io-client';

// 서버의 URL을 입력하세요.
const SERVER_URL = 'http://localhost:3000'; // 서버 URL에 맞게 변경

// 소켓 인스턴스 타입 정의
const socket: SocketIOClient = io(SERVER_URL, {
  transports: ['websocket'], // 두 가지 방식을 모두 허용 'polling', 
  withCredentials: true, // CORS 관련 설정
  path: '/socket.io',
});
// const socket: Socket = io('http://localhost:3000', {
//   withCredentials: true,
// });


// 서버 측에서 사용자 정보 수신 처리
socket.on('connect',() => {
  console.log('소켓 서버와 연결됨');
});

socket.on('disconnect', () => {
  console.log('소켓 서버와 연결이 끊어짐');
});


// 연결 에러 핸들러 추가
socket.on('connect_error', (error) => {
  console.error('소켓 연결 에러:', error);
});

// 소켓을 내보냅니다.
export default socket;
