/*
 * File Name    : graph_type.ts
 * Description  : 그래프 관련 타입을 모아두는 파일
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created     인생그래프 데이터 타입 분리
 * 2024.09.11    김민지      Modified
 * 2024.09.13    김재영      Done        관련 채팅방 검색 및 참여, 커뮤니티 피드 제공 기능 추가 및 완료
 */

export type lifeData = { age: number; score: number; title: string; desc?: string };

export type lifeDataArray = lifeData[];
