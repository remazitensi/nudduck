/*
 * File Name    : CreateDetailGraph.tsx
 * Description  : chart.js 데이터와 옵션
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김민지      Created      더미 데이터로 디자인 옵션 선정
 * 2024.09.22    김민지      Modified     리스트용과 상세페이지용 그래프 분리
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

export const CreateDetailGraph: React.FC<CreateListGraphProps> = ({ events }) => {
  const lifeData = events;

  //data에서 age를 라벨 추출
  const labels: number[] = events.map((item) => item.age);
  console.log(labels);

  //labels 에서 최소, 최댓값 추출 => 차트
  const age: { min: number; max: number } = {
    min: Math.min(...labels),
    max: Math.max(...labels),
  };

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
          title: (tooltipItems) => {
            const item = tooltipItems[0].parsed; // Get the current item
            return item.title; // Set tooltip title to item.title
          },
          label: (tooltipItem) => {
            const item = tooltipItem.parsed; // Get the current item
            return item.description; // Set tooltip body to item.description
          },
        },
        bodyFont: {
          size: 15, // Set tooltip font size
        },
        intersect: false, // Make tooltip show even if mouse is not directly on the point
        mode: 'nearest', // Use 'nearest' to allow tooltip to show for the nearest point
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
          callback: (value) => {
            if (value === -6 || value === 6) {
              return '';
            }
            return value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest', // Allows tooltip to show for the nearest point
      intersect: false, // Tooltip will show even if not directly on the point
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
          intersect: true,
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
        borderWidth: 15,
        backgroundColor: (context) => {
          return 'rgba(173, 216, 175, 0.5)';
        },
      },
    ],
  };

  return (
    <div className='flex items-center'>
      <Line options={options} className='h-full w-full' data={data} />
    </div>
  );
};
