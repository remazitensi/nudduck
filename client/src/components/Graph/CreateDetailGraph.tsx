/*
 * File Name    : CreateDetailGraph.tsx
 * Description  : chart.js 데이터와 옵션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created      더미 데이터로 디자인 옵션 선정
 * 2024.09.22    김민지      Modified     리스트용과 상세페이지용 그래프 분리
 * 2024.10.01    김민지      Modified     커스텀 툴팁 추가
 */

import { CategoryScale, Chart as ChartJS, ChartOptions, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip, TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GraphEvent } from '../../types/graph-type';
// import { lifeData } from '../../types/graph-type';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface CreateListGraphProps {
  events: GraphEvent[]; // events는 GraphEvent 타입 배열
}

export const CreateDetailGraph: React.FC<CreateListGraphProps> = ({ events }) => {
  const lifeData = events;

  //data에서 age를 라벨 추출
  const labels: number[] = events.map((item) => item.age);

  //labels 에서 최소, 최댓값 추출 => 차트
  const age: { min: number; max: number } = {
    min: Math.min(...labels),
    max: Math.max(...labels),
  };

  const options: ChartOptions<'line'> = {
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
      //   tooltip: {
      //     // 툴팁 커스텀 미완성으로 인한 주석처리
      //     // callbacks: {
      //     //   title: (tooltipItems) => {
      //     //     const item = tooltipItems[0].parsed; // Get the current item
      //     //     return item.title; // Set tooltip title to item.title
      //     //   },
      //     //   label: (tooltipItem) => {
      //     //     const item = tooltipItem.parsed; // Get the current item
      //     //     return item.description; // Set tooltip body to item.description
      //     //   },
      //     // },
      //     bodyFont: {
      //       size: 15, // Set tooltip font size
      //     },
      //     intersect: false, // Make tooltip show even if mouse is not directly on the point
      //     mode: 'nearest', // Use 'nearest' to allow tooltip to show for the nearest point
      //   },
      // },
      tooltip: {
        callbacks: {
          // 나이와 점수를 툴팁에 표시
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            const item = tooltipItems[0].parsed; // 데이터 접근
            return `나이: ${item.x}`; // 나이 (x축 값) 표시
          },
          label: (tooltipItem: TooltipItem<'line'>) => {
            const item = tooltipItem.parsed; // 데이터 접근
            return `점수: ${item.y}`; // 점수 (y축 값) 표시
          },
        },
        backgroundColor: 'rgba(128, 128, 128, 0.8)', // 툴팁 배경을 회색으로 설정
        borderColor: '#ccc', // 테두리 색상 설정 (원하는 색상으로 변경 가능)
        borderWidth: 1, // 테두리 두께 설정
        bodyFont: {
          size: 16, // 툴팁 글씨 크기
        },
        titleFont: {
          size: 16, // 툴팁 제목 글씨 크기
        },
        displayColors: false, // 툴팁 옆에 색깔 박스 제거
        intersect: false, // 점 위에 마우스를 올리지 않아도 툴팁 표시
        mode: 'nearest', // 가까운 점의 툴팁을 표시
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
          stepSize: 1,
        },
      },
      y: {
        min: -6,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => {
            const numericValue = typeof value === 'number' ? value : Number(value);
            if (numericValue === -6 || numericValue === 6) {
              return '';
            }
            return numericValue;
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        data: lifeData,
        fill: 'origin',
        parsing: {
          xAxisKey: 'age',
          yAxisKey: 'score',
        },
        borderColor: (value: { parsed: { y: number } }) => {
          const condition = value.parsed;
          if (condition && condition.y > 0) {
            return '#1E90FF';
          } else if (condition && condition.y < 0) {
            return '#FF6347';
          }
          return '#6B8E23';
        },
        borderWidth: 15,
        backgroundColor: () => {
          return 'rgba(173, 216, 175, 0.5)';
        },
      },
    ],
  };

  return (
    <div className='w-full'>
      <Line options={options} data={data} />
    </div>
  );
};
