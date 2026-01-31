import type { ChartData as ChartJsData, ChartOptions } from 'chart.js';

// --- Core Game Theory Types ---

export interface ComponentScores {
    E: number;  // Economic Impact
    D: number;  // Domestic Political Impact
    T: number;  // Technological Dominance
    S: number;  // Supply Chain Security
}

export interface Weights {
    us: ComponentScores;
    china: ComponentScores;
}

export interface ScenarioScores {
    us: ComponentScores;
    china: ComponentScores;
}

export interface PayoffCell {
    us: number;
    china: number;
}

export interface ScenarioData {
    context: string;
    baseScores: ScenarioScores[][][];
}

export interface Scenarios {
    [key: string]: ScenarioData;
}

export interface StrategyOption {
    key: string;
    label: string;
}

export interface GlossaryEntry {
    term: string;
    definition: string;
}

// --- Chart Types (properly typed for Chart.js) ---

export type PieChartData = ChartJsData<'pie', number[], string>;
export type RadarChartData = ChartJsData<'radar', number[], string>;
export type BarChartData = ChartJsData<'bar', number[], string>;

export interface OutcomeChartData {
    payoffDistribution: PieChartData | null;
    radarData: RadarChartData | null;
}

// --- Component Props Types ---

export interface ScenarioSelectorProps {
    scenario: string | null;
    setScenario: (scenario: string) => void;
    scenarioOptions: string[];
    scenarioContext: string;
}

export interface StrategySelectorProps {
    usStrategy: string | null;
    setUsStrategy: (strategy: string) => void;
    chinaStrategy: string | null;
    setChinaStrategy: (strategy: string) => void;
    strategyOptions: StrategyOption[];
}

export interface PayoffMatrixProps {
    payoffMatrix: PayoffCell[][];
    baseScores: ScenarioScores[][];
    isNashEquilibrium: (matrix: PayoffCell[][], row: number, col: number) => boolean;
    isParetoOptimal: (matrix: PayoffCell[][], row: number, col: number) => boolean;
    strategyOptions: StrategyOption[];
    usStrategy: string | null;
    chinaStrategy: string | null;
}

export interface OutcomeChartsProps {
    matrix: PayoffCell[][];
    baseScores: ScenarioScores[][];
    selections: {
        scenario: string | null;
        us: string | null;
        china: string | null;
    };
    strategyOptions: StrategyOption[];
}

export interface GlossaryPanelProps {
    glossaryTerms: GlossaryEntry[];
}

export interface RecommendationsPanelProps {
    scenario: string | null;
    usStrategy: string | null;
    chinaStrategy: string | null;
}

// --- Custom Scenario Builder Types ---

export interface CustomScenario {
    id: string;
    name: string;
    context: string;
    weights: Weights;
    baseScores: ScenarioScores[][];
    createdAt: number;
}

export interface CustomScenarioBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (scenario: CustomScenario) => void;
    editingScenario?: CustomScenario | null;
    strategyOptions: StrategyOption[];
}

export interface WeightSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    player: 'us' | 'china';
}

export interface ScoreInputGridProps {
    baseScores: ScenarioScores[][];
    onChange: (rowIndex: number, colIndex: number, player: 'us' | 'china', component: keyof ComponentScores, value: number) => void;
    strategyOptions: StrategyOption[];
}

// --- Interactive Payoff Matrix Types ---

export interface InteractivePayoffMatrixProps extends PayoffMatrixProps {
    onCellClick?: (usStrategyKey: string, chinaStrategyKey: string) => void;
    highlightedCells?: Array<{ row: number; col: number }>;
    showMiniCharts?: boolean;
}

// --- Scenario Selector with Custom Scenarios ---

export interface EnhancedScenarioSelectorProps extends ScenarioSelectorProps {
    customScenarios: CustomScenario[];
    onCreateCustom: () => void;
    onEditCustom: (scenario: CustomScenario) => void;
    onDeleteCustom: (id: string) => void;
    isCustomScenario: boolean;
}
