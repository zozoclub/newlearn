import React, { useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 추가

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

  // 기존 차트 인스턴스를 저장할 ref
  const doughnutChartInstance = useRef<Chart<"doughnut"> | null>(null);
  const barChartInstance = useRef<Chart<"bar"> | null>(null);

  useEffect(() => {
    // 도넛형 차트 (Pronunciation Score)
    if (doughnutChartRef.current) {
      const doughnutCtx = doughnutChartRef.current.getContext("2d");
      if (doughnutCtx) {
        if (doughnutChartInstance.current) {
          doughnutChartInstance.current.destroy();
        }

        doughnutChartInstance.current = new Chart<
          "doughnut",
          number[],
          unknown
        >(doughnutCtx, {
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
            cutout: "65%",
            plugins: {
              legend: { display: true },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.label + ": " + context.raw + "점";
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

                const centerX = width / 2;
                const centerY = (height * 53) / 100;

                ctx.save();
                ctx.font = "bold 2rem Pretendard";
                ctx.fillStyle = theme.colors.primary;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${score}점`, centerX, centerY);
                ctx.restore();
              },
            },
          ],
        });
      }
    }

    // 수평 막대형 차트 (4개의 항목)
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext("2d");
      if (barCtx) {
        if (barChartInstance.current) {
          barChartInstance.current.destroy();
        }

        barChartInstance.current = new Chart<"bar", number[], unknown>(barCtx, {
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
            indexAxis: "y", // 수평 막대형 차트
            scales: {
              x: {
                max: 100, // 100점 만점 기준
                grid: { display: false },
                ticks: {
                  display: false, // X축 수치 숨기기
                },
                border: { display: false },
              },
              y: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                  font: {
                    family: "Pretendard",
                    size: 14,
                    weight: "bold",
                  },
                  color: theme.colors.text,
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
              datalabels: {
                align: "end", // 텍스트를 막대 끝에 배치
                anchor: "end", // 막대 끝에 수직 배치
                formatter: (value) => `${value}`, // "점수/100" 형식으로 출력
                font: {
                  size: 14,
                  family: "Pretendard",
                },
                color: theme.colors.text, // 텍스트 색상 설정
              },
            },
            font: {
              family: "Pretendard",
              size: 14,
              weight: "normal",
            },
          },
          plugins: [ChartDataLabels], // 플러그인 적용
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
