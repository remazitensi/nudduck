/*
 * File Name    : GraphList.tsx
 * Description  : 그래프 ID에 해당하는 그래프 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created
 * 2024.09.11    김민지      Modified    더미데이터로 그래프 생성 및 디자인 테스트
 * 2024.09.13    김재영      Done        관련 채팅방 검색 및 참여, 커뮤니티 피드 제공 기능 추가 및 완료
 */

import { Graph } from '../../components/Graph/Graph';
import { lifeDataArray } from '../../types/graph_type';

// res.data
const lifeData: lifeDataArray = [
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

export const GraphList = () => {
  return (
    <div>
      <Graph lifeData={lifeData}></Graph>
    </div>
  );
};
