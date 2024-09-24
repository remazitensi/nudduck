import { api, baseApi } from '../base-api';

export const deleteGraph = async (id: number) => {
  try {
    const data = await baseApi.delete(`${api.lifeGraph}/${id}`, {});
    if (data.status === 200) {
      console.log(data);
      alert('성공적으로 인생 그래프가 삭제되었습니다!');
    }
  } catch (err) {
    alert(err.message);
  }
};

export const fetchLifeGraphs = async (currentPage: number) => {
  try {
    const page = currentPage;
    const response = await baseApi.get(api.lifeGraph, {
      params: { page, limit: 6 },
    });
    return response.data;
  } catch (error) {
    console.error('인생그래프를 불러오는데 실패했습니다.', error);
  }
};

// 그래프 상세페이지 get 조회
export const getDetailGraphData = async (id: number) => {
  try {
    const response = await baseApi.get(`${api.lifeGraph}/${id}`, {});
    return response.data;
  } catch (err) {
    alert(err.message);
  }
};
