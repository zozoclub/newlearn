import React, { useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Chart } from "chart.js/auto";

type Props = {
  results: {
    pronunciationScore: number;
    accuracyScore: number;
    fluencyScore: number;
    prosodyScore: number;
    completenessScore: number;
  };
};

const SpeakingTestResultCharts: React.FC<Props> = ({ results }) => {
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);

  const theme = useTheme();

  useEffect(() => {
    // 도넛형 차트 (Pronunciation Score)
    if (doughnutChartRef.current) {
      const doughnutCtx = doughnutChartRef.current.getContext("2d");
      if (doughnutCtx) {
        new Chart(doughnutCtx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [
                  results.pronunciationScore,
                  100 - results.pronunciationScore,
                ],
                backgroundColor: [theme.colors.primary, "#ddd"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: "70%",
            plugins: {
              legend: { display: true },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.label + ": " + context.raw + "%";
                  },
                },
                bodyFont: {
                  size: 14,
                  family: "Pretendard",
                },
              },
            },
            font: {
              family: "Pretendard",
              size: 16,
              weight: "bold",
            },
          },
          plugins: [
            {
              id: "doughnutScoreLabel",
              afterDraw(chart) {
                const { ctx, width, height } = chart;
                const score = results.pronunciationScore;

                // 텍스트 위치 계산
                const centerX = width / 2;
                const centerY = (height * 53) / 100;

                ctx.save();
                ctx.font = "bold 2rem Pretendard";
                ctx.fillStyle = theme.colors.primary;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // 텍스트를 차트 중심에 정확히 배치
                ctx.fillText(`${score}%`, centerX, centerY);
                ctx.restore();
              },
            },
          ],
        });
      }
    }

    // 수평 막대형 차트 (나머지 점수들)
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext("2d");
      if (barCtx) {
        new Chart(barCtx, {
          type: "bar",
          data: {
            labels: ["Accuracy", "Fluency", "Prosody", "Completeness"],
            datasets: [
              {
                label: "Score",
                data: [
                  results.accuracyScore,
                  results.fluencyScore,
                  results.prosodyScore,
                  results.completenessScore,
                ],
                backgroundColor: theme.colors.primary, 
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, 
            indexAxis: "y", 
            scales: {
              x: {
                max: 100, // 100점 만점 기준
                ticks: {
                  font: {
                    family: "Pretendard", 
                    size: 14, 
                    weight: "normal", 
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    family: "Pretendard",
                    size: 14,
                    weight: "bold",
                  },
                },
              },
            },
            plugins: {
              legend: { display: false }, 
              tooltip: {
                bodyFont: {
                  size: 14, 
                  family: "Pretendard", 
                },
              },
            },
            font: {
              family: "Pretendard", 
              size: 14,
              weight: "normal", 
            },
          },
        });
      }
    }
  }, [results, theme]);
  return (
    <ChartContainer>
      <DoughnutChartContainer>
        <canvas ref={doughnutChartRef}></canvas>
      </DoughnutChartContainer>
      <BarChartContainer>
        <canvas ref={barChartRef}></canvas>
      </BarChartContainer>
    </ChartContainer>
  );
};

export default SpeakingTestResultCharts;

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

const DoughnutChartContainer = styled.div`
  width: 35%;
  margin: auto;
  position: relative;
  height: 15rem;
`;

const BarChartContainer = styled.div`
  width: 60%;
  margin: 3rem auto 0 auto;
  position: relative;
  height: 15rem;
`;
