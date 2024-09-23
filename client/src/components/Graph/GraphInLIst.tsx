// 안 쓰는 파일 (정리할 것)

import { Graph } from './CreateListGraph';

// res.data
const lifeData = [
  { age: 17, score: 4, title: '일본 유학' },
  { age: 20, score: 3, title: '대학 입학', desc: '엘리스 대학교 AI학과 입학' },
  { age: 21, score: 4, title: '유럽 여행' },
  { age: 22, score: -1, title: '인턴 계속 탈락' },
  { age: 23, score: -3, title: '휴학' },
  { age: 23, score: 5, title: '제주 1년 살기' },
  { age: 25, score: 5, title: '대만 워킹홀리데이 시작' },
  { age: 26, score: -1, title: '대만생활' },
  { age: 27, score: 4, title: '결혼' },
];

export const GraphInList = () => {
  return (
    <div>
      <Graph lifeData={lifeData}></Graph>
    </div>
  );
};
