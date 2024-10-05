import React from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import {
  CategoryCountKey,
  CategoryCountType,
  getLabelFromKey,
  getUserChart,
} from "@services/mypageService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const CategoryChart: React.FC = () => {
  const theme = useTheme();

  // 카테고리 별 읽은 수 가져오기
  const { data: countData } = useQuery<CategoryCountType | null>({
    queryKey: ["categoryCountData"],
    queryFn: getUserChart,
  });

  if (!countData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // 차트의 최대 개수를 카테고리 읽은 수 중 최댓값으로 설정하기 위함
  const maxValue = Math.max(...Object.values(countData));

  // 차트
  const chartData = {
    labels: Object.keys(countData).map((key) =>
      getLabelFromKey(key as CategoryCountKey)
    ),
    datasets: [
      {
        label: "카테고리 별 통계",
        data: Object.values(countData),
        fill: true,
        backgroundColor: `${theme.colors.primary}33`,
        borderColor: theme.colors.primary,
        pointBackgroundColor: theme.colors.primary,
        pointBorderColor: theme.colors.primary,
        pointHoverBackgroundColor: theme.colors.primary,
        pointHoverBorderColor: theme.colors.primary,
      },
    ],
  };

  // 차트 옵션
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: theme.colors.text04,
        },
        grid: {
          color: theme.colors.text04,
        },
        suggestedMin: 0,
        suggestedMax: maxValue > 0 ? maxValue : 1,
        ticks: {
          stepSize: 10,
          font: {
            size: 12,
          },
          color: theme.colors.text,
          backdropColor: `${theme.colors.cardBackground}`,
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 600,
          },
          color: theme.colors.text,
        },
      },
    },
    font: {
      size: 16,
    },
  };

  return (
    <ChartContainer>
      <Radar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default CategoryChart;

const ChartContainer = styled.div`
  width: 95%;
`;
