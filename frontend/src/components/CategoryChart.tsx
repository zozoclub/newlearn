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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type CountDataKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "entertainCount";

type CountData = {
  [K in CountDataKey]: number;
};

const getLabelFromKey = (key: CountDataKey): string => {
  const labelMap: Record<typeof key, string> = {
    economyCount: "경제",
    politicsCount: "정치",
    societyCount: "사회",
    cultureCount: "생활/문화",
    scienceCount: "IT/과학",
    entertainCount: "연예",
  };
  return labelMap[key] || key;
};

interface CategoryChartProps {
  countData: CountData;
  height: number;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ countData, height }) => {
  const theme = useTheme();

  const maxValue = Math.max(...Object.values(countData));
  const chartData = {
    labels: Object.keys(countData).map((key) =>
      getLabelFromKey(key as CountDataKey)
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
        suggestedMax: maxValue,
        ticks: {
          stepSize: 5,
          font: {
            size: 12,
          },
          color: theme.colors.text,
          backdropColor: `${theme.colors.cardBackground}`,
        },
        pointLabels: {
          font: {
            size: 12,
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
    <ChartContainer $height={height}>
      <Radar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default CategoryChart;

const ChartContainer = styled.div<{ $height: number }>`
  width: 100%;
  height: ${(props) => props.$height};
`;
