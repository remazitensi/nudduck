/*
 * File Name    : experts-api.ts
 * Description  : experts-api 설정
 * Author       : 임형선
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.25    임형선      Created
 */

import { isAxiosError } from 'axios';
import { api, baseApi } from './base-api';

interface ExpertsProfile {
  id: number;
  name: string;
  jobTitle: string;
  age: number;
  bio: string;
  profileImage: string;
  email: string;
  phone: string;
  cost: number;
  hashtags: string;
  totalCount: number;
}

// 전문가 리스트 가져오기
export async function fetchExperts(page: number = 1, limit: number = 10) {
  const url = `${api.expert}?page=${page}&limit=${limit}`;
  try {
    const response = await baseApi.get<{ data: ExpertsProfile[]; totalCount: number }>(url);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// 전문가 상세 정보 가져오기
export async function fetchExpertDetails(id: number) {
  const url = `${api.expert}/${id}`;
  try {
    const response = await baseApi.get<ExpertsProfile>(url);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}
