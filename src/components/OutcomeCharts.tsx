import { useState, useEffect } from 'react';
import { Pie, Radar } from 'react-chartjs-2';
import type { OutcomeChartsProps, OutcomeChartData, PieChartData, RadarChartData } from '../types';

function OutcomeCharts({ matrix, baseScores, selections, strategyOptions }: OutcomeChartsProps): JSX.Element {
    const [chartData, setChartData] = useState<OutcomeChartData>({
        payoffDistribution: null,
        radarData: null,
    });

    const chartKey = `${selections.scenario}-${selections.us}-${selections.china}`;

    useEffect(() => {
        if (matrix && matrix.length > 0 && baseScores && baseScores.length > 0 &&
            selections.us && selections.china && selections.scenario) {
            const usIndex = strategyOptions.findIndex(o => o.key === selections.us);
            const chinaIndex = strategyOptions.findIndex(o => o.key === selections.china);

            if (usIndex === -1 || chinaIndex === -1) return;

            const currentPayoff = matrix[usIndex][chinaIndex];
            const base = baseScores[usIndex][chinaIndex];

            const payoffDistribution: PieChartData = {
                labels: ['U.S. Payoff', 'China Payoff'],
                datasets: [{
                    label: 'Total Payoff',
                    data: [currentPayoff.us, currentPayoff.china],
                    backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                    borderColor: ['#fff', '#fff'],
                    borderWidth: 2,
                }]
            };

            const radarData: RadarChartData = {
                labels: ['Economic Impact (E)', 'Domestic Politics (D)', 'Tech Dominance (T)', 'Supply Chain (S)'],
                datasets: [
                    {
                        label: 'U.S. Base Scores',
                        data: [base.us.E, base.us.D, base.us.T, base.us.S],
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                    },
                    {
                        label: 'China Base Scores',
                        data: [base.china.E, base.china.D, base.china.T, base.china.S],
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(239, 68, 68, 1)',
                    }
                ]
            };

            setChartData({ payoffDistribution, radarData });
        } else {
            setChartData({ payoffDistribution: null, radarData: null });
        }
    }, [matrix, baseScores, selections, strategyOptions]);

    if (!chartData.payoffDistribution || !chartData.radarData) {
        return <div className="card"><p>Select strategies to see outcome charts.</p></div>;
    }

    return (
        <div className="card">
            <h3>Outcome Analysis</h3>
            <div className="charts-grid-enhanced">
                <div className="chart-container">
                    <h4>Strategic Priorities (Base Scores)</h4>
                    <Radar
                        key={`${chartKey}-radar`}
                        data={chartData.radarData}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    suggestedMin: -10,
                                    suggestedMax: 10
                                }
                            }
                        }}
                    />
                </div>
                <div className="chart-container">
                    <h4>Total Payoff Distribution</h4>
                    <Pie
                        key={`${chartKey}-pie`}
                        data={chartData.payoffDistribution}
                        options={{ maintainAspectRatio: false }}
                    />
                </div>
            </div>
        </div>
    );
}

export default OutcomeCharts;
