/*
 * File Name    : Graph.tsx
 * Description  : chart.js 데이터와 옵션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created      더미 데이터로 디자인 옵션 선정
 */

import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
// import { lifeData } from '../../types/graph_type';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// TODO : 옵션설정 : 범례 없애기, 0 중심줄 강조, 컬러, 선 둥글게, 선 두껍게, 툴팁에 제목 나오게 등

export const Graph: React.FC = () => {
  const lifeData = [
    { age: 17, score: 4, title: '일본 유학' },
    { age: 18, score: 2, title: '일본 유학' },
    { age: 19, score: -2, title: '일본 유학' },
    { age: 20, score: 3, title: '대학 입학', desc: '엘리스 대학교 AI학과 입학' },
    { age: 21, score: 4, title: '유럽 여행' },
    { age: 22, score: -1, title: '인턴 계속 탈락' },
    { age: 23, score: -3, title: '휴학' },
    { age: 24, score: 5, title: '제주 1년 살기' },
    { age: 25, score: 5, title: '대만 워킹홀리데이 시작' },
    { age: 26, score: -1, title: '대만생활' },
    { age: 27, score: 4, title: '결혼' },
  ];

  //data에서 age를 라벨 추출
  const labels: number[] = lifeData.map((item: lifeData) => item.age);
  console.log(labels);

  //labels 에서 최소, 최댓값 추출 => 차트
  const age: { min: number; max: number } = {
    min: Math.min(...labels),
    max: Math.max(...labels),
  };

  // 색상 변경 함수
  // const handleColor = ({ context }) => {
  //   console.log(context);
  //   const index = context.dataIndex;
  //   const value = context.dataset.data[index];
  //   return value < 0 ? 'red' : 'blue';
  // };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    // false : 늘어날 때도 비율 안 맞추고 부모 박스 크기에 맞춘 반응형
    // true : 늘어날 때는 그대로, 비율 맞춰서 줄어들기만
    plugins: {
      filler: {
        propagate: true,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: age.min, // x 축의 최소값
        max: age.max, // x 축의 최대값
        ticks: {
          // display: false, //축 숫자 안 보이게
          stepSize: 1,
        },
        grid: {
          // display: false, // x축 그리드 선 숨기기
        },
        axis: {
          // display: false, // x축 자체와 레이블 숨기기
        },
      },
      y: {
        min: -6,
        max: 6,
        ticks: {
          // display: false, // 축 숫자 안 보이게
          stepSize: 1,
          callback: (value) => {
            if (value === -6 || value === 6) {
              return '';
            }
            return value;
          },
        },
        grid: {
          // display: false, // x축 그리드 선 숨기기
        },
        axis: {
          // display: false, // x축 자체와 레이블 숨기기
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        data: lifeData,
        fill: 'origin',
        parsing: {
          xAxisKey: 'age',
          yAxisKey: 'score',
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        borderColor: (value) => {
          const condition = value.parsed;
          if (condition && condition.y > 0) {
            return '#1E90FF';
          } else if (condition && condition.y < 0) {
            return '#FF6347';
          }
          return '#6B8E23';
        },
        borderWidth: 6,
        backgroundColor: (context) => {
          // const index = context.dataIndex;
          // const value = context.dataset.data[index];
          // try {
          //   console.log(value.score);
          //   // return value.score < 0 ? 'red' : 'blue';
          //   // 현재 결과 : default black 값이 뜸
          // } catch {
          //   console.log('-');
          // }

          return 'rgba(173, 216, 175, 0.5)';
        },
      },
    ],
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};

// borderColor: '#D15F5F',
// backgroundColor: 'rgba(255, 209, 187, 0.5)',

// borderColor: (value) => {
//   const condition = value.parsed;
//   if (condition && condition.y > 0) {
//     return 'blue';
//   } else if (condition && condition.y < 0) {
//     return 'red';
//   }
//   return 'black';

// borderColor: (context) => {
//   // console.log(context);
//   const index = context.dataIndex;
//   const value = context.dataset.data[index];
// console.log(value.score)
//   return value < 0 ? 'red' : 'blue';
// }

// console.log(value);
// console.log(context.parsed.y);
// if (context.raw.score > 0) {
//   return 'blue';
// }
