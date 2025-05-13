import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OutcomeCharts from './OutcomeCharts';
import ScenarioSelector from './components/ScenarioSelector';
import StrategySelector from './components/StrategySelector';
import PayoffMatrix from './components/PayoffMatrix';
import EditableMatrix from './components/EditableMatrix';
import GlossaryPanel from './components/GlossaryPanel'; // Import the new component
import RecommendationsPanel from './components/RecommendationsPanel'; // Import the new component

// Constants
const strategyOptions = ['Aggressive', 'Moderate', 'Passive'];
const scenarioOptions = ["Tech Decoupling", "Rare Earth Embargo", "Global Alliance Expansion"];
const glossaryTerms = [
    { term: 'Nash Equilibrium', definition: 'A situation where no player can benefit by changing strategies unilaterally.' },
    { term: 'Pareto Optimality', definition: 'An outcome where no player can be made better off without making another worse off.' },
    { term: 'Game Theory', definition: 'The study of mathematical models of strategic interactions among rational agents.' }
];

// Component
function USChinaSimulation() {
    const navigate = useNavigate();
    const [scenario, setScenario] = useState(null);
    const [usStrategy, setUsStrategy] = useState(null);
    const [chinaStrategy, setChinaStrategy] = useState(null);
    const [payoffMatrix, setPayoffMatrix] = useState([]);
    const [scenarioContext, setScenarioContext] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [chartData, setChartData] = useState(null);

    // Utility Functions
    const generatePayoffMatrix = ({ usStrategy, chinaStrategy }) => {
        // Dynamic logic to generate a payoff matrix based on strategies
        if (usStrategy === 'Aggressive' && chinaStrategy === 'Aggressive') {
            return [
                [{ us: 2, china: 2 }, { us: 1, china: 3 }, { us: 0, china: 4 }],
                [{ us: 3, china: 1 }, { us: 2, china: 2 }, { us: 1, china: 3 }],
                [{ us: 4, china: 0 }, { us: 3, china: 1 }, { us: 2, china: 2 }]
            ];
        } else if (usStrategy === 'Aggressive' && chinaStrategy === 'Moderate') {
            return [
                [{ us: 3, china: 1 }, { us: 2, china: 2 }, { us: 1, china: 3 }],
                [{ us: 4, china: 0 }, { us: 3, china: 1 }, { us: 2, china: 2 }],
                [{ us: 5, china: -1 }, { us: 4, china: 0 }, { us: 3, china: 1 }]
            ];
        } else if (usStrategy === 'Moderate' && chinaStrategy === 'Passive') {
            return [
                [{ us: 4, china: 2 }, { us: 3, china: 3 }, { us: 2, china: 4 }],
                [{ us: 5, china: 1 }, { us: 4, china: 2 }, { us: 3, china: 3 }],
                [{ us: 6, china: 0 }, { us: 5, china: 1 }, { us: 4, china: 2 }]
            ];
        } else if (usStrategy === 'Passive' && chinaStrategy === 'Aggressive') {
            return [
                [{ us: 1, china: 5 }, { us: 0, china: 6 }, { us: -1, china: 7 }],
                [{ us: 2, china: 4 }, { us: 1, china: 5 }, { us: 0, china: 6 }],
                [{ us: 3, china: 3 }, { us: 2, china: 4 }, { us: 1, china: 5 }]
            ];
        } else {
            // Default matrix for other combinations
            return [
                [{ us: 2, china: 2 }, { us: 2, china: 2 }, { us: 2, china: 2 }],
                [{ us: 2, china: 2 }, { us: 2, china: 2 }, { us: 2, china: 2 }],
                [{ us: 2, china: 2 }, { us: 2, china: 2 }, { us: 2, china: 2 }]
            ];
        }
    };
    const isNashEquilibrium = (matrix, row, col) => false; // Placeholder logic
    const isParetoOptimal = (matrix, row, col) => false; // Placeholder logic

    const updateMatrixCell = (rowIndex, colIndex, role, value) => {
        setPayoffMatrix((prevMatrix) => {
            const updatedMatrix = [...prevMatrix];
            updatedMatrix[rowIndex][colIndex] = {
                ...updatedMatrix[rowIndex][colIndex],
                [role]: value
            };
            return updatedMatrix;
        });
    };

    const prepareChartData = (matrix, selections) => {
        const { usStrategy, chinaStrategy } = selections;
        return {
            labels: ['US Payoff', 'China Payoff'],
            datasets: [
                {
                    label: 'Payoff Summary',
                    data: [
                        matrix[usStrategy]?.[chinaStrategy]?.us || 0,
                        matrix[usStrategy]?.[chinaStrategy]?.china || 0
                    ],
                    backgroundColor: ['#4caf50', '#2196f3']
                }
            ]
        };
    };

    const loadScenarioPayoffMatrix = (selectedScenario) => {
        switch (selectedScenario) {
            case "Tech Decoupling":
                return [
                    [{ us: 3, china: 2 }, { us: 1, china: 1 }, { us: 0, china: 3 }],
                    [{ us: 2, china: 3 }, { us: 1, china: 1 }, { us: 3, china: 0 }],
                    [{ us: 1, china: 1 }, { us: 2, china: 2 }, { us: 0, china: 0 }]
                ];
            case "Rare Earth Embargo":
                return [
                    [{ us: 2, china: 1 }, { us: 3, china: 0 }, { us: 1, china: 2 }],
                    [{ us: 0, china: 3 }, { us: 1, china: 1 }, { us: 2, china: 2 }],
                    [{ us: 1, china: 2 }, { us: 0, china: 3 }, { us: 3, china: 0 }]
                ];
            case "Global Alliance Expansion":
                return [
                    [{ us: 1, china: 1 }, { us: 2, china: 2 }, { us: 3, china: 0 }],
                    [{ us: 2, china: 2 }, { us: 1, china: 1 }, { us: 0, china: 3 }],
                    [{ us: 3, china: 0 }, { us: 1, china: 1 }, { us: 2, china: 2 }]
                ];
            default:
                return [];
        }
    };

    const loadScenarioContext = (selectedScenario) => {
        switch (selectedScenario) {
            case "Tech Decoupling":
                return "A scenario where the U.S. and China decouple their technology sectors.";
            case "Rare Earth Embargo":
                return "A scenario where China imposes an embargo on rare earth exports.";
            case "Global Alliance Expansion":
                return "A scenario where the U.S. and China compete for global alliances.";
            default:
                return "";
        }
    };

    // Effects
    useEffect(() => {
        if (scenario) {
            const matrix = loadScenarioPayoffMatrix(scenario);
            setPayoffMatrix(matrix);
            const context = loadScenarioContext(scenario);
            setScenarioContext(context);
        }
    }, [scenario]);

    useEffect(() => {
        if (usStrategy && chinaStrategy) {
            const matrix = generatePayoffMatrix({ usStrategy, chinaStrategy });
            setPayoffMatrix(matrix);
        }
    }, [usStrategy, chinaStrategy]);

    useEffect(() => {
        if (payoffMatrix.length && usStrategy !== null && chinaStrategy !== null) {
            const data = prepareChartData(payoffMatrix, { usStrategy, chinaStrategy });
            setChartData(data);
        }
    }, [payoffMatrix, usStrategy, chinaStrategy]);

    useEffect(() => {
        if (usStrategy && chinaStrategy) {
            const newRecommendations = [];
            if (usStrategy === 'Aggressive' && chinaStrategy === 'Passive') {
                newRecommendations.push('The U.S. may dominate in the short term, but risks long-term retaliation.');
            }
            if (usStrategy === 'Moderate' && chinaStrategy === 'Moderate') {
                newRecommendations.push('Both nations may achieve balanced outcomes with minimal conflict.');
            }
            if (usStrategy === 'Passive' && chinaStrategy === 'Aggressive') {
                newRecommendations.push('China may gain an upper hand, but risks overextension.');
            }
            setRecommendations(newRecommendations);
        }
    }, [usStrategy, chinaStrategy]);

    // Main Render
    return (
        <div className="container">
            <header className="header">
                <h1>US-China Simulation</h1>
                <button className="home-button" onClick={() => navigate('/vqm-TradeWarX/')}>Home</button>
            </header>
            <main className="main-content">
                <ScenarioSelector
                    scenario={scenario}
                    setScenario={setScenario}
                    scenarioOptions={scenarioOptions}
                    scenarioContext={scenarioContext}
                />
                <StrategySelector
                    usStrategy={usStrategy}
                    setUsStrategy={setUsStrategy}
                    chinaStrategy={chinaStrategy}
                    setChinaStrategy={setChinaStrategy}
                    strategyOptions={strategyOptions}
                />
                <PayoffMatrix
                    matrix={payoffMatrix}
                    isNashEquilibrium={isNashEquilibrium}
                    isParetoOptimal={isParetoOptimal}
                    handleStrategySelection={() => {}}
                />
                <EditableMatrix
                    matrix={payoffMatrix}
                    updateMatrixCell={updateMatrixCell}
                    prepareChartData={prepareChartData}
                    setChartData={setChartData}
                    setRecommendations={setRecommendations}
                    usStrategy={usStrategy}
                    chinaStrategy={chinaStrategy}
                />
                {payoffMatrix ? <OutcomeCharts matrix={payoffMatrix} selections={{ us: usStrategy, china: chinaStrategy }} /> : null}
                <GlossaryPanel glossaryTerms={glossaryTerms} />
                <RecommendationsPanel recommendations={recommendations} />
            </main>
        </div>
    );
}

export default USChinaSimulation;