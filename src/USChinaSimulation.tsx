import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './css/USChinaSimulation.css';

// Import types
import type { PayoffCell, ScenarioScores, CustomScenario } from './types';

// Import data
import { weights, scenarios, scenarioOptions, strategyOptions, glossaryTerms } from './data';

// Import utilities
import {
    isNashEquilibrium,
    isParetoOptimal,
    generatePayoffMatrix,
    loadCustomScenarios,
    saveCustomScenario,
    deleteCustomScenario
} from './utils';

// Import components
import {
    EnhancedScenarioSelector,
    StrategySelector,
    PayoffMatrix,
    OutcomeCharts,
    GlossaryPanel,
    RecommendationsPanel,
    MethodologyPanel,
    CustomScenarioBuilder,
} from './components';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function USChinaSimulation(): JSX.Element {
    // Core state
    const [scenario, setScenario] = useState<string | null>(null);
    const [usStrategy, setUsStrategy] = useState<string | null>(null);
    const [chinaStrategy, setChinaStrategy] = useState<string | null>(null);

    // Custom scenario state
    const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
    const [isCustomScenario, setIsCustomScenario] = useState(false);
    const [builderOpen, setBuilderOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState<CustomScenario | null>(null);

    // Load custom scenarios from localStorage on mount
    useEffect(() => {
        setCustomScenarios(loadCustomScenarios());
    }, []);

    // Handle scenario selection (built-in or custom)
    const handleSetScenario = useCallback((scenarioId: string) => {
        // Check if it's a custom scenario
        const custom = customScenarios.find(s => s.id === scenarioId);
        if (custom) {
            setScenario(scenarioId);
            setIsCustomScenario(true);
        } else {
            setScenario(scenarioId);
            setIsCustomScenario(false);
        }
    }, [customScenarios]);

    // Get current scenario data (built-in or custom)
    const currentScenarioData = useMemo(() => {
        if (!scenario) return null;

        if (isCustomScenario) {
            const custom = customScenarios.find(s => s.id === scenario);
            return custom ? {
                context: custom.context,
                baseScores: custom.baseScores,
                weights: custom.weights
            } : null;
        }

        return {
            context: scenarios[scenario].context,
            baseScores: scenarios[scenario].baseScores,
            weights: weights
        };
    }, [scenario, isCustomScenario, customScenarios]);

    // Calculate payoff matrix when scenario changes
    const { payoffMatrix, baseScores } = useMemo(() => {
        if (!currentScenarioData) {
            return {
                payoffMatrix: [] as PayoffCell[][],
                baseScores: [] as ScenarioScores[][]
            };
        }

        const matrix = generatePayoffMatrix(
            currentScenarioData.baseScores,
            currentScenarioData.weights
        );

        return {
            payoffMatrix: matrix,
            baseScores: currentScenarioData.baseScores
        };
    }, [currentScenarioData]);

    // Reset strategy selections when scenario changes
    useEffect(() => {
        if (scenario) {
            setUsStrategy(null);
            setChinaStrategy(null);
        }
    }, [scenario]);

    // Custom scenario handlers
    const handleCreateCustom = useCallback(() => {
        setEditingScenario(null);
        setBuilderOpen(true);
    }, []);

    const handleEditCustom = useCallback((customScenario: CustomScenario) => {
        setEditingScenario(customScenario);
        setBuilderOpen(true);
    }, []);

    const handleDeleteCustom = useCallback((id: string) => {
        const updated = deleteCustomScenario(id);
        setCustomScenarios(updated);

        // If the deleted scenario was selected, clear selection
        if (scenario === id) {
            setScenario(null);
            setIsCustomScenario(false);
        }
    }, [scenario]);

    const handleSaveCustom = useCallback((customScenario: CustomScenario) => {
        const updated = saveCustomScenario(customScenario);
        setCustomScenarios(updated);

        // Select the newly created/edited scenario
        setScenario(customScenario.id);
        setIsCustomScenario(true);
    }, []);

    // Handle cell click in interactive matrix
    const handleCellClick = useCallback((usStrategyKey: string, chinaStrategyKey: string) => {
        setUsStrategy(usStrategyKey);
        setChinaStrategy(chinaStrategyKey);
    }, []);

    // Get context for current scenario
    const scenarioContext = currentScenarioData?.context || '';

    return (
        <div className="container">
            <header className="header">
                <h1>The Bellicose Duopoly: A US-China Strategic Simulation</h1>
                <p>An Interactive Game Theory Model Based on the 2025 Trade War Analysis</p>
            </header>
            <main className="main-content">
                <div className="column">
                    <EnhancedScenarioSelector
                        scenario={scenario}
                        setScenario={handleSetScenario}
                        scenarioOptions={scenarioOptions}
                        scenarioContext={scenarioContext}
                        customScenarios={customScenarios}
                        onCreateCustom={handleCreateCustom}
                        onEditCustom={handleEditCustom}
                        onDeleteCustom={handleDeleteCustom}
                        isCustomScenario={isCustomScenario}
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
                        onCellClick={handleCellClick}
                    />
                    <MethodologyPanel />
                </div>
                <div className="column">
                    <OutcomeCharts
                        matrix={payoffMatrix}
                        baseScores={baseScores}
                        selections={{
                            scenario,
                            us: usStrategy,
                            china: chinaStrategy
                        }}
                        strategyOptions={strategyOptions}
                    />
                    <RecommendationsPanel
                        scenario={scenario}
                        usStrategy={usStrategy}
                        chinaStrategy={chinaStrategy}
                    />
                    <GlossaryPanel glossaryTerms={glossaryTerms} />
                </div>
            </main>

            {/* Custom Scenario Builder Modal */}
            <CustomScenarioBuilder
                isOpen={builderOpen}
                onClose={() => {
                    setBuilderOpen(false);
                    setEditingScenario(null);
                }}
                onSave={handleSaveCustom}
                editingScenario={editingScenario}
                strategyOptions={strategyOptions}
            />
        </div>
    );
}

export default USChinaSimulation;
