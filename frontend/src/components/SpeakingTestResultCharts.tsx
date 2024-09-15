import React, { useEffect, useRef } from "react";
import styled from "styled-components";
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

  useEffect(() => {
    // 도넛형 차트 (Pronunciation Score)
    if (doughnutChartRef.current) {
      const doughnutCtx = doughnutChartRef.current.getContext("2d");
      if (doughnutCtx) {
        new Chart(doughnutCtx, {
          type: "doughnut",
          data: {
            labels: ["Pronunciation Score"],
            datasets: [
              {
                data: [
                  results.pronunciationScore,
                  100 - results.pronunciationScore,
                ],
                backgroundColor: ["blue", "#ddd"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            cutout: "70%",
            plugins: {
              legend: { display: true },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.label + ": " + context.raw + "%";
                  },
                },
              },
            },
          },
          plugins: [
            {
              id: "doughnutScoreLabel",
              afterDraw(chart) {
                const { ctx, width, height } = chart;
                const score = results.pronunciationScore;
                ctx.save();
                ctx.font = "bold 1.5rem Pretendard";
                ctx.fillStyle = getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--theme-text");
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${score}%`, width / 2, height / 2);
              },
            },
          ],
        });
      }
    }

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
                backgroundColor: "blue",
              },
            ],
          },
          options: {
            indexAxis: "y", // 수평 막대형 차트
            scales: {
              x: {
                max: 100, // 100점 만점 기준
              },
              y: {},
            },
            plugins: {
              legend: { display: false }, // 범례 비활성화
            },
          },
        });
      }
    }
  }, [results]);

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
  width: 40%;
  margin: auto;
`;

const BarChartContainer = styled.div`
  width: 60%;
  margin: 3rem auto 0 auto;
`;
