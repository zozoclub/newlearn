import React from "react";
import styled, { useTheme } from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { useRecoilValue } from "recoil";
import { goalAverageSelector } from "@store/goalState";

const GoalChartDoughnut: React.FC = () => {
  const { perAverage, displayPerAverage } = useRecoilValue(goalAverageSelector);
  const theme = useTheme();
  const fillColor = theme.colors.primary;
  const emptyColor = theme.colors.cancel;

  const doughnutData = {
    datasets: [
      {
        data: [perAverage, 100 - perAverage],
        backgroundColor: [fillColor, emptyColor],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <DoughnutContainer>
      <Doughnut data={doughnutData} options={doughnutOptions} />
      <DoughnutText>{displayPerAverage}</DoughnutText>
    </DoughnutContainer>
  );
};

export default GoalChartDoughnut;

const DoughnutContainer = styled.div`
  position: relative;
`;

const DoughnutText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.25rem;
  font-weight: bold;
  transform: translate(-50%, -50%);
`;
