/*
 * File Name    : graph-type.ts
 * Description  : 그래프 관련 타입을 모아두는 파일
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created     인생그래프 데이터 타입 분리
 * 2024.09.11    김민지      Modified
 * 2024.09.13    김재영      Done        관련 채팅방 검색 및 참여, 커뮤니티 피드 제공 기능 추가 및 완료
 */

// 각 이벤트의 타입 정의
export type GraphEvent = {
  age: number;
  score: number;
  title: string;
  description: string;
};

// 각 그래프 데이터 객체의 타입 정의
export type GraphData = {
  id: number;
  current_age: number;
  title: string;
  events: GraphEvent[]; // events는 GraphEvent 배열
  created_at: string;
  updated_at: string;
};

// 전체 그래프 목록 데이터의 타입 정의
export type GraphListData = {
  data: GraphData[]; // data는 GraphData 배열
  totalCount: number;
};

export type GraphSectionProps = {
  id: number;
  current_age: number;
  title: string;
  events: GraphEvent[]; // events는 GraphEvent 배열
  created_at: string;
  updated_at: string;
};
