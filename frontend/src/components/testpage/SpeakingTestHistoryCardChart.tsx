import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { useTheme } from 'styled-components';

ChartJS.register(ArcElement, Tooltip, Legend);

type SpeakingTestHistoryCardChartProps = {
    accuracyScore: number;
    fluencyScore: number;
    prosodyScore: number;
    completenessScore: number;
};

const SpeakingTestHistoryCardChart: React.FC<SpeakingTestHistoryCardChartProps> = ({
    accuracyScore,
    fluencyScore,
    prosodyScore,
    completenessScore,
}) => {
    const theme = useTheme();

    const data: ChartData<'pie'> = {
        labels: ['Accuracy', 'Fluency', 'Prosody', 'Completion'],
        datasets: [
            {
                label: 'Accuracy',
                data: [accuracyScore, 100 - accuracyScore],
                backgroundColor: ['#FF6384', theme.colors.readonly],
            },
            {
                label: 'Fluency',
                data: [fluencyScore, 100 - fluencyScore],
                backgroundColor: ['#36A2EB', theme.colors.readonly],
            },
            {
                label: 'Prosody',
                data: [prosodyScore, 100 - prosodyScore],
                backgroundColor: ['#FFCE56', theme.colors.readonly],
            },
            {
                label: 'Completion',
                data: [completenessScore, 100 - completenessScore],
                backgroundColor: ['#4CAF50', theme.colors.readonly],
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // 범례를 비활성화하여 숨김
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return <Pie data={data} options={options} />;
};

export default SpeakingTestHistoryCardChart;
