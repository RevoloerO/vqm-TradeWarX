import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
    CategoryScale, 
    LinearScale, 
    BarController, 
    BarElement, 
    LineController, 
    LineElement, 
    PointElement, 
    ArcElement,
    Tooltip,
    Chart 
} from 'chart.js';

Chart.register([
    CategoryScale, 
    LinearScale, 
    BarController, 
    BarElement, 
    LineController, 
    LineElement, 
    PointElement,
    ArcElement,
    Tooltip
]);

export default function OutcomeCharts({ matrix, selections }) {
    const [chartData, setChartData] = useState({
        frequencyData: null,
        outcomeTrend: null,
        payoffDistribution: null
    });
    const [isDataReady, setIsDataReady] = useState(false);

    // Formats payoff matrix + selection history into chart data
    function prepareChartData(matrix, selections) {
        const frequency = {
            labels: ['Aggressive', 'Moderate', 'Passive'],
            datasets: [
                {
                    label: 'U.S. Strategy Frequency',
                    data: [3, 5, 2], // Example counts
                    backgroundColor: ['#1d4ed8', '#2563eb', '#3b82f6']
                }
            ]
        };

        const outcomeTrend = {
            labels: ['Turn 1', 'Turn 2', 'Turn 3'],
            datasets: [
                {
                    label: 'U.S. Payoffs',
                    data: [2, 3, 1],
                    borderColor: '#1d4ed8'
                },
                {
                    label: 'China Payoffs',
                    data: [1, 4, 2],
                    borderColor: '#dc2626'
                }
            ]
        };

        const payoffDistribution = {
            labels: ['U.S.', 'China'],
            datasets: [
                {
                    label: 'Total Payoff',
                    data: [18, 22],
                    backgroundColor: ['#1d4ed8', '#dc2626']
                }
            ]
        };

        return { frequencyData: frequency, outcomeTrend, payoffDistribution };
    }

    // Watch for changes in matrix or selection state
    useEffect(() => {
        if (matrix && selections) {
            const data = prepareChartData(matrix, selections);
            setChartData(data);
            setIsDataReady(true);
        } else {
            setIsDataReady(false);
        }
    }, [matrix, selections]);

    if (!isDataReady) {
        return <p>Loading charts...</p>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div>
                <h3>Strategy Frequency</h3>
                <Bar data={chartData.frequencyData} />
            </div>
            <div>
                <h3>Outcome Trends</h3>
                <Line data={chartData.outcomeTrend} />
            </div>
            <div>
                <h3>Payoff Distribution</h3>
                <Pie data={chartData.payoffDistribution} />
            </div>
        </div>
    );
}
