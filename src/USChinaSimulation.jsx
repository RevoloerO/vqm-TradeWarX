import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement, // Added to fix registration error
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './css/USChinaSimulation.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement, // Added to fix registration error
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// --- Data and Logic from Research Paper ---

const weights = {
    us: { E: 0.30, D: 0.35, T: 0.25, S: 0.10 },
    china: { E: 0.40, D: 0.30, T: 0.20, S: 0.10 },
};

const scenarios = {
    "Tech War": {
        context: "A direct confrontation focused on technological dominance. The US employs export controls on semiconductors and AI, while China leverages its control over tech manufacturing and supply chains.",
        baseScores: [ // Rows: US Strategies, Cols: China Strategies
            // China: De-escalate, Status Quo, Escalate Symmetrically, Escalate Asymmetrically
            [ // US: De-escalate
                { us: { E: 5, D: -6, T: -5, S: 3 }, china: { E: 5, D: -6, T: 2, S: 3 } },
                { us: { E: 3, D: -4, T: -7, S: 1 }, china: { E: 6, D: 4, T: 5, S: 4 } },
                { us: { E: -2, D: -5, T: -8, S: -4 }, china: { E: 3, D: 6, T: 7, S: 2 } },
                { us: { E: -5, D: -7, T: -10, S: -8 }, china: { E: 0, D: 8, T: 8, S: -2 } }
            ],
            [ // US: Status Quo
                { us: { E: 6, D: 4, T: 4, S: 2 }, china: { E: 2, D: -3, T: -4, S: 0 } },
                { us: { E: 2, D: 2, T: 2, S: 0 }, china: { E: 2, D: 2, T: 2, S: 0 } },
                { us: { E: -3, D: 3, T: 0, S: -5 }, china: { E: -2, D: 5, T: 4, S: -3 } },
                { us: { E: -6, D: 1, T: -2, S: -9 }, china: { E: -4, D: 7, T: 6, S: -5 } }
            ],
            [ // US: Escalate Symmetrically
                { us: { E: 4, D: 6, T: 6, S: 5 }, china: { E: -4, D: -4, T: -6, S: -5 } },
                { us: { E: -1, D: 5, T: 5, S: -2 }, china: { E: -3, D: 3, T: -3, S: -2 } },
                { us: { E: -5, D: 0, T: -4, S: -7 }, china: { E: -6, D: 0, T: -5, S: -6 } },
                { us: { E: -8, D: -2, T: -6, S: -10 }, china: { E: -7, D: -1, T: -4, S: -8 } }
            ],
            [ // US: Escalate Asymmetrically
                { us: { E: 2, D: 8, T: 8, S: 3 }, china: { E: -7, D: -5, T: -8, S: -7 } },
                { us: { E: 0, D: 7, T: 7, S: -1 }, china: { E: -5, D: 0, T: -6, S: -4 } },
                { us: { E: -4, D: 2, T: 3, S: -6 }, china: { E: -8, D: -2, T: -7, S: -8 } },
                { us: { E: -7, D: -4, T: -5, S: -9 }, china: { E: -10, D: -6, T: -10, S: -10 } }
            ]
        ]
    },
    "Trade & Tariffs": {
        context: "A broad-based conflict using tariffs as the primary weapon, justified by trade imbalances and domestic issues (e.g., fentanyl precursors). This reflects the tit-for-tat escalation cycles.",
        baseScores: [
            // China: De-escalate, Status Quo, Escalate Symmetrically, Escalate Asymmetrically
            [ // US: De-escalate
                { us: { E: 7, D: -7, T: 0, S: 2 }, china: { E: 7, D: -7, T: 1, S: 2 } },
                { us: { E: 4, D: -5, T: -2, S: 0 }, china: { E: 8, D: 5, T: 3, S: 4 } },
                { us: { E: -2, D: -6, T: -3, S: -3 }, china: { E: 4, D: 7, T: 4, S: 1 } },
                { us: { E: -4, D: -8, T: -4, S: -5 }, china: { E: 1, D: 8, T: 5, S: -2 } }
            ],
            [ // US: Status Quo
                { us: { E: 8, D: 6, T: 2, S: 3 }, china: { E: 3, D: -2, T: -1, S: 0 } },
                { us: { E: 3, D: 3, T: 0, S: 0 }, china: { E: 3, D: 3, T: 0, S: 0 } },
                { us: { E: -4, D: 4, T: -1, S: -4 }, china: { E: -3, D: 5, T: -2, S: -3 } },
                { us: { E: -6, D: 2, T: -2, S: -6 }, china: { E: -5, D: 6, T: 2, S: -5 } }
            ],
            [ // US: Escalate Symmetrically
                { us: { E: 5, D: 8, T: 1, S: 4 }, china: { E: -5, D: -5, T: -3, S: -4 } },
                { us: { E: -2, D: 6, T: 0, S: -2 }, china: { E: -4, D: 4, T: -2, S: -2 } },
                { us: { E: -7, D: 0, T: -5, S: -8 }, china: { E: -8, D: 0, T: -6, S: -8 } },
                { us: { E: -9, D: -2, T: -6, S: -9 }, china: { E: -7, D: -1, T: -4, S: -7 } }
            ],
            [ // US: Escalate Asymmetrically
                { us: { E: 3, D: 7, T: 5, S: 2 }, china: { E: -6, D: -6, T: -7, S: -6 } },
                { us: { E: -1, D: 5, T: 4, S: -3 }, china: { E: -5, D: 1, T: -5, S: -4 } },
                { us: { E: -5, D: 1, T: 2, S: -7 }, china: { E: -9, D: -3, T: -8, S: -9 } },
                { us: { E: -8, D: -5, T: -2, S: -10 }, china: { E: -10, D: -7, T: -5, S: -10 } }
            ]
        ]
    }
};

const calculatePayoff = (scores, player, currentWeights) => {
    const w = currentWeights[player];
    return (scores[player].E * w.E + scores[player].D * w.D + scores[player].T * w.T + scores[player].S * w.S).toFixed(2);
};

// --- Child Components ---

function ScenarioSelector({ scenario, setScenario, scenarioOptions, scenarioContext }) {
    return (
        <div className="card">
            <h3>Select Conflict Scenario</h3>
            <select
                className="dropdown"
                value={scenario || ''}
                onChange={(e) => setScenario(e.target.value)}
            >
                <option value="" disabled>Select a scenario...</option>
                {scenarioOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {scenarioContext && <div className="context"><p>{scenarioContext}</p></div>}
        </div>
    );
}

function StrategySelector({ usStrategy, setUsStrategy, chinaStrategy, setChinaStrategy, strategyOptions }) {
    return (
        <div className="card">
            <h3>Select Strategies</h3>
            <div className="strategy-group">
                <div className="strategy-selection">
                    <h4>U.S. Strategy</h4>
                    {strategyOptions.map((option) => (
                        <button
                            key={`us-${option.key}`}
                            className={`strategy-button ${usStrategy === option.key ? 'selected' : ''}`}
                            onClick={() => setUsStrategy(option.key)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="strategy-selection">
                    <h4>China's Strategy</h4>
                    {strategyOptions.map((option) => (
                        <button
                            key={`china-${option.key}`}
                            className={`strategy-button ${chinaStrategy === option.key ? 'selected' : ''}`}
                            onClick={() => setChinaStrategy(option.key)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PayoffMatrix({ payoffMatrix, baseScores, isNashEquilibrium, isParetoOptimal, strategyOptions, usStrategy, chinaStrategy }) {
    if (!payoffMatrix || payoffMatrix.length === 0) {
        return <div className="card"><p>Please select a scenario to view the payoff matrix.</p></div>;
    }
    
    const usIndex = strategyOptions.findIndex(o => o.key === usStrategy);
    const chinaIndex = strategyOptions.findIndex(o => o.key === chinaStrategy);

    const renderTooltipContent = (scores) => (
        <div className="tooltip-grid">
            <div className="tooltip-header">Base Scores</div>
            <strong>Component</strong><strong>US</strong><strong>China</strong>
            <strong>Eco. Impact (E)</strong><span>{scores.us.E}</span><span>{scores.china.E}</span>
            <strong>Dom. Politics (D)</strong><span>{scores.us.D}</span><span>{scores.china.D}</span>
            <strong>Tech Dom. (T)</strong><span>{scores.us.T}</span><span>{scores.china.T}</span>
            <strong>Supply Chain (S)</strong><span>{scores.us.S}</span><span>{scores.china.S}</span>
        </div>
    );

    return (
        <div className="card">
            <h3>Payoff Matrix (Calculated Utility)</h3>
            <div className="table-container">
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th></th>
                            {strategyOptions.map(opt => <th key={opt.key}>{opt.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {payoffMatrix.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th>{strategyOptions[rowIndex].label}</th>
                                {row.map((cell, colIndex) => {
                                    const isSelected = rowIndex === usIndex && colIndex === chinaIndex;
                                    const isNash = isNashEquilibrium(payoffMatrix, rowIndex, colIndex);
                                    const isPareto = isParetoOptimal(payoffMatrix, rowIndex, colIndex);
                                    let cellClasses = 'matrix-cell';
                                    if (isSelected) cellClasses += ' selected';
                                    if (isNash) cellClasses += ' nash';
                                    if (isPareto) cellClasses += ' pareto';

                                    return (
                                        <td key={colIndex} className={cellClasses}>
                                            <div className="tooltip">{renderTooltipContent(baseScores[rowIndex][colIndex])}</div>
                                            <span>US: {cell.us}</span>
                                            <span>China: {cell.china}</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OutcomeCharts({ matrix, selections, strategyOptions }) {
    const [chartData, setChartData] = useState({
        payoffDistribution: null,
        radarData: null,
    });
    
    // Create a key that changes when selections change to force re-render
    const chartKey = `${selections.scenario}-${selections.us}-${selections.china}`;

    useEffect(() => {
        if (matrix && matrix.length > 0 && selections.us && selections.china) {
            const usIndex = strategyOptions.findIndex(o => o.key === selections.us);
            const chinaIndex = strategyOptions.findIndex(o => o.key === selections.china);

            if (usIndex === -1 || chinaIndex === -1) return;

            const currentPayoff = matrix[usIndex][chinaIndex];
            const base = scenarios[selections.scenario].baseScores[usIndex][chinaIndex];

            const payoffDistribution = {
                labels: ['U.S. Payoff', 'China Payoff'],
                datasets: [{
                    label: 'Total Payoff',
                    data: [currentPayoff.us, currentPayoff.china],
                    backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                    borderColor: ['#fff'],
                    borderWidth: 2,
                }]
            };

            const radarData = {
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
    }, [matrix, selections, strategyOptions]);

    if (!chartData.payoffDistribution) {
        return <div className="card"><p>Select strategies to see outcome charts.</p></div>;
    }

    return (
        <div className="card">
            <h3>Outcome Analysis</h3>
            <div className="charts-grid-enhanced">
                <div className="chart-container">
                    <h4>Strategic Priorities (Base Scores)</h4>
                    <Radar key={`${chartKey}-radar`} data={chartData.radarData} options={{ maintainAspectRatio: false, scales: { r: { suggestedMin: -10, suggestedMax: 10 } } }} />
                </div>
                <div className="chart-container">
                    <h4>Total Payoff Distribution</h4>
                    <Pie key={`${chartKey}-pie`} data={chartData.payoffDistribution} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}


function GlossaryPanel({ glossaryTerms }) {
    return (
        <div className="card">
            <h3>Glossary</h3>
            <ul className="glossary-list">
                {glossaryTerms.map((entry, index) => (
                    <li key={index}>
                        <strong>{entry.term}:</strong> {entry.definition}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RecommendationsPanel({ scenario, usStrategy, chinaStrategy }) {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const getRecs = () => {
            if (!scenario || !usStrategy || !chinaStrategy) {
                return ["Select a scenario and strategies for analysis."];
            }
            if (usStrategy.includes('Escalate') && chinaStrategy.includes('Escalate')) {
                return [
                    "High-level escalation risks 'Mutually Assured Economic Destruction'.",
                    "This path is highly unstable and likely to cause severe economic harm to both players, as seen in the 2025 tariff brinkmanship.",
                    "Consider initiating negotiations to find an off-ramp and de-escalate to a more manageable, though still hostile, 'Unstable Détente'."
                ];
            }
            if (usStrategy === 'De-escalate' && chinaStrategy === 'De-escalate') {
                return [
                    "Mutual de-escalation leads to a 'Grand Bargain' scenario with the highest economic payoffs.",
                    "However, the paper notes this is politically costly for both leaders, who may be seen as 'caving' to the other side.",
                    "This outcome, while economically optimal, is considered politically infeasible in the current climate of deep mistrust."
                ];
            }
            if ((usStrategy.includes('Escalate') && chinaStrategy.includes('StatusQuo')) || (usStrategy.includes('StatusQuo') && chinaStrategy.includes('Escalate'))) {
                 return [
                    "This dynamic reflects the 'Unstable Détente' equilibrium.",
                    "One side pushes, the other holds, leading to periods of tension followed by potential negotiation.",
                    "This state of perpetual, managed hostility avoids total disaster but creates a permanent 'uncertainty tax' on the economy."
                 ];
            }
            return ["Analyze the payoff matrix to identify the rational response. The most likely real-world outcome is a cycle of escalation and de-escalation ('Unstable Détente')."];
        };
        setRecommendations(getRecs());
    }, [scenario, usStrategy, chinaStrategy]);


    if (!recommendations || recommendations.length === 0) return null;
    return (
        <div className="card recommendations-panel">
            <h3>Strategic Analysis & Recommendations</h3>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );
}

function MethodologyPanel() {
    return (
        <div className="card methodology-section">
            <h3>Model Methodology (Based on "The Bellicose Duopoly")</h3>
            <p>This simulation implements the game theory model from the research paper. The outcome payoffs are not arbitrary; they are calculated using a multi-attribute utility function for each nation.</p>
            <p><strong>Payoff Formula:</strong> $Payoff(P) = w_1 \cdot E + w_2 \cdot D + w_3 \cdot T + w_4 \cdot S$</p>
            <ul>
                <li><strong>E (Economic Impact):</strong> Change in GDP, inflation, and key sector health.</li>
                <li><strong>D (Domestic Political Impact):</strong> Leadership approval, media narrative, and support from key constituencies.</li>
                <li><strong>T (Technological Dominance):</strong> Progress in the race for technological supremacy and self-sufficiency.</li>
                <li><strong>S (Supply Chain Security):</strong> Access to critical materials (e.g., rare earths, semiconductors).</li>
            </ul>
            <p><strong>Strategic Weights (w):</strong> The model uses the specific weights assigned in the paper, reflecting each nation's strategic priorities:</p>
            <ul>
                <li><strong>United States:</strong> Economic (30%), Political (35%), Tech (25%), Supply Chain (10%).</li>
                <li><strong>China:</strong> Economic (40%), Political (30%), Tech (20%), Supply Chain (10%).</li>
            </ul>
            <p>For each scenario, the underlying scores (-10 to +10 for each component) are estimated based on the paper's qualitative analysis. You can hover over any cell in the payoff matrix to see the score breakdown. This model aims to simulate the complex, multi-faceted decision-making of state leaders as described in the research.</p>
        </div>
    );
}

// --- Main App Component ---

function USChinaSimulation() {
    // State
    const [scenario, setScenario] = useState(null);
    const [usStrategy, setUsStrategy] = useState(null);
    const [chinaStrategy, setChinaStrategy] = useState(null);
    
    // Constants from paper
    const strategyOptions = [
        { key: 'De-escalate', label: 'De-escalate' },
        { key: 'StatusQuo', label: 'Status Quo' },
        { key: 'EscalateSymmetrically', label: 'Escalate Symmetrically' },
        { key: 'EscalateAsymmetrically', label: 'Escalate Asymmetrically' },
    ];
    const scenarioOptions = Object.keys(scenarios);
    const glossaryTerms = [
        { term: 'Nash Equilibrium', definition: 'A stable outcome where no player can benefit by changing their strategy unilaterally, assuming the other player\'s strategy remains constant.' },
        { term: 'Pareto Optimality', definition: 'An outcome where no player can be made better off without making at least one other player worse off. It represents the set of most efficient outcomes.' },
        { term: 'Unstable Détente', definition: 'The predicted equilibrium from the paper; a cycle of escalation and de-escalation where conflict is managed but never resolved, creating persistent uncertainty.' },
        { term: 'Dual Circulation Strategy', definition: 'China\'s strategy to reorient its economy by boosting domestic consumption and achieving technological self-sufficiency to reduce vulnerability to external pressure.' },
    ];

    // --- Logic and Effects ---

    const { payoffMatrix, baseScores } = useMemo(() => {
        if (!scenario) return { payoffMatrix: [], baseScores: [] };
        
        const scenarioData = scenarios[scenario];
        const matrix = scenarioData.baseScores.map(row => 
            row.map(scores => ({
                us: parseFloat(calculatePayoff(scores, 'us', weights)),
                china: parseFloat(calculatePayoff(scores, 'china', weights)),
            }))
        );
        return { payoffMatrix: matrix, baseScores: scenarioData.baseScores };

    }, [scenario]);

    const isNashEquilibrium = (matrix, row, col) => {
        if (!matrix || !matrix[row] || !matrix[row][col]) return false;
        const usPayoff = matrix[row][col].us;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i][col].us > usPayoff) return false;
        }
        const chinaPayoff = matrix[row][col].china;
        for (let j = 0; j < matrix[row].length; j++) {
            if (matrix[row][j].china > chinaPayoff) return false;
        }
        return true;
    };

    const isParetoOptimal = (matrix, row, col) => {
        if (!matrix || !matrix[row] || !matrix[row][col]) return false;
        const { us, china } = matrix[row][col];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j].us > us && matrix[i][j].china >= china) || (matrix[i][j].us >= us && matrix[i][j].china > china)) {
                    return false; 
                }
            }
        }
        return true;
    };
    
    useEffect(() => {
        if (scenario) {
            setUsStrategy(null);
            setChinaStrategy(null);
        }
    }, [scenario]);


    // --- Main Render ---
    return (
        <div className="container">
            <header className="header">
                <h1>The Bellicose Duopoly: A US-China Strategic Simulation</h1>
                <p>An Interactive Game Theory Model Based on the 2025 Trade War Analysis</p>
            </header>
            <main className="main-content">
                <div className="column">
                    <ScenarioSelector
                        scenario={scenario}
                        setScenario={setScenario}
                        scenarioOptions={scenarioOptions}
                        scenarioContext={scenario ? scenarios[scenario].context : ''}
                    />
                    <StrategySelector
                        usStrategy={usStrategy}
                        setUsStrategy={setUsStrategy}
                        chinaStrategy={chinaStrategy}
                        setChinaStrategy={setChinaStrategy}
                        strategyOptions={strategyOptions}
                    />
                    <PayoffMatrix
                        payoffMatrix={payoffMatrix}
                        baseScores={baseScores}
                        isNashEquilibrium={isNashEquilibrium}
                        isParetoOptimal={isParetoOptimal}
                        strategyOptions={strategyOptions}
                        usStrategy={usStrategy}
                        chinaStrategy={chinaStrategy}
                    />
                    <MethodologyPanel />
                </div>
                <div className="column">
                    <OutcomeCharts
                        matrix={payoffMatrix}
                        selections={{ scenario, us: usStrategy, china: chinaStrategy }}
                        strategyOptions={strategyOptions}
                    />
                    <RecommendationsPanel scenario={scenario} usStrategy={usStrategy} chinaStrategy={chinaStrategy} />
                    <GlossaryPanel glossaryTerms={glossaryTerms} />
                </div>
            </main>
        </div>
    );
}

export default USChinaSimulation;
