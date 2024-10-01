/*
 * File Name    : CreateListGraph.tsx
 * Description  : chart.js 데이터와 옵션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created      더미 데이터로 디자인 옵션 선정
 * 2024.09.22    김민지      Modified     리스트용과 상세페이지용 그래프 분리
 * 2024.10.01    김민지      Modified     커스텀 툴팁 추가
 */

import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GraphEvent } from '../../types/graph-type';
// import { lifeData } from '../../types/graph-type';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// TODO : 옵션설정 : 범례 없애기, 0 중심줄 강조, 컬러, 선 둥글게, 선 두껍게, 툴팁에 제목 나오게 등

interface CreateListGraphProps {
  events: GraphEvent[]; // events는 GraphEvent 타입 배열
}

export const CreateListGraph: React.FC<CreateListGraphProps> = ({ events }) => {
  const lifeData = events;

  //data에서 age를 라벨 추출 (완료)
  const labels: number[] = events.map((item) => item.age);

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
      tooltip: {
        callbacks: {
          // 툴팁에 나이와 점수를 표시
          title: (tooltipItems) => {
            const item = tooltipItems[0].parsed; // 데이터 접근
            return `나이: ${item.x}`; // 나이 (x축 값) 표시
          },
          label: (tooltipItem) => {
            const item = tooltipItem.parsed; // 데이터 접근
            return `점수: ${item.y}`; // 점수 (y축 값) 표시
          },
        },
        backgroundColor: 'rgba(128, 128, 128, 0.8)', // 툴팁 배경을 회색으로 설정
        borderColor: '#ccc', // 테두리 색상 설정 (원하는 색상으로 변경 가능)
        borderWidth: 1, // 테두리 두께 설정
        bodyFont: {
          size: 14, // 툴팁 글씨 크기
        },
        titleFont: {
          size: 14, // 툴팁 제목 글씨 크기
        },
        displayColors: false, // 툴팁 옆에 색깔 박스 제거
        intersect: false, // 점 위에 마우스를 올리지 않아도 툴팁 표시
        mode: 'nearest', // 가까운 점의 툴팁을 표시
      },
      interaction: {
        mode: 'nearest', // 가까운 점의 툴팁을 표시
        intersect: false, // 점 위에 마우스를 올리지 않아도 툴팁 표시
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
          display: false, // 축 숫자 안 보이게
          stepSize: 1,
        },
        grid: {
          display: false, // x축 그리드 선 숨기기
        },
        axis: {
          display: false, // x축 자체와 레이블 숨기기
        },
      },
      y: {
        min: -6,
        max: 6,
        ticks: {
          display: false, // 축 숫자 안 보이게
          stepSize: 1,
          callback: (value) => {
            if (value === -6 || value === 6) {
              return '';
            }
            return value;
          },
        },
        grid: {
          display: false, // x축 그리드 선 숨기기
        },
        axis: {
          display: false, // x축 자체와 레이블 숨기기
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
