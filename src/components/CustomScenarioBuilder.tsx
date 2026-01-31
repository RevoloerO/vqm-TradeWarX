import { useState, useEffect, useCallback } from 'react';
import type {
    CustomScenarioBuilderProps,
    CustomScenario,
    ComponentScores,
    ScenarioScores,
    Weights,
    StrategyOption
} from '../types';
import { weights as defaultWeights } from '../data';

// Generate a unique ID for new scenarios
const generateId = (): string => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create empty base scores matrix (4x4)
const createEmptyBaseScores = (): ScenarioScores[][] => {
    const emptyScores: ComponentScores = { E: 0, D: 0, T: 0, S: 0 };
    return Array(4).fill(null).map(() =>
        Array(4).fill(null).map(() => ({
            us: { ...emptyScores },
            china: { ...emptyScores }
        }))
    );
};

// Weight Slider Component
interface WeightSliderProps {
    label: string;
    shortLabel: string;
    value: number;
    onChange: (value: number) => void;
    color: string;
}

function WeightSlider({ label, shortLabel, value, onChange, color }: WeightSliderProps): JSX.Element {
    return (
        <div className="weight-slider">
            <div className="weight-slider-header">
                <span className="weight-label" title={label}>{shortLabel}</span>
                <span className="weight-value" style={{ color }}>{(value * 100).toFixed(0)}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={value * 100}
                onChange={(e) => onChange(Number(e.target.value) / 100)}
                className="weight-range"
                style={{ accentColor: color }}
                aria-label={`${label} weight`}
            />
        </div>
    );
}

// Score Input Component for a single cell
interface ScoreInputProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
}

function ScoreInput({ value, onChange, label }: ScoreInputProps): JSX.Element {
    return (
        <input
            type="number"
            min="-10"
            max="10"
            value={value}
            onChange={(e) => onChange(Math.max(-10, Math.min(10, Number(e.target.value) || 0)))}
            className="score-input"
            aria-label={label}
        />
    );
}

// Cell Editor Component for editing a single strategy combination
interface CellEditorProps {
    scores: ScenarioScores;
    onChange: (player: 'us' | 'china', component: keyof ComponentScores, value: number) => void;
    usStrategy: string;
    chinaStrategy: string;
}

function CellEditor({ scores, onChange, usStrategy, chinaStrategy }: CellEditorProps): JSX.Element {
    const components: Array<{ key: keyof ComponentScores; label: string; short: string }> = [
        { key: 'E', label: 'Economic Impact', short: 'Eco' },
        { key: 'D', label: 'Domestic Politics', short: 'Pol' },
        { key: 'T', label: 'Tech Dominance', short: 'Tech' },
        { key: 'S', label: 'Supply Chain', short: 'Sup' },
    ];

    return (
        <div className="cell-editor">
            <div className="cell-editor-header">
                <span className="us-label">US: {usStrategy}</span>
                <span className="vs-label">vs</span>
                <span className="china-label">China: {chinaStrategy}</span>
            </div>
            <div className="cell-editor-grid">
                <div className="cell-editor-row header-row">
                    <span></span>
                    <span className="player-header us">US</span>
                    <span className="player-header china">China</span>
                </div>
                {components.map(({ key, label, short }) => (
                    <div key={key} className="cell-editor-row">
                        <span className="component-label" title={label}>{short}</span>
                        <ScoreInput
                            value={scores.us[key]}
                            onChange={(v) => onChange('us', key, v)}
                            label={`US ${label}`}
                        />
                        <ScoreInput
                            value={scores.china[key]}
                            onChange={(v) => onChange('china', key, v)}
                            label={`China ${label}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main Custom Scenario Builder Component
function CustomScenarioBuilder({
    isOpen,
    onClose,
    onSave,
    editingScenario,
    strategyOptions
}: CustomScenarioBuilderProps): JSX.Element | null {
    const [name, setName] = useState('');
    const [context, setContext] = useState('');
    const [weights, setWeights] = useState<Weights>({ ...defaultWeights });
    const [baseScores, setBaseScores] = useState<ScenarioScores[][]>(createEmptyBaseScores());
    const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    // Reset form when opening/closing or when editing scenario changes
    useEffect(() => {
        if (isOpen) {
            if (editingScenario) {
                setName(editingScenario.name);
                setContext(editingScenario.context);
                setWeights({ ...editingScenario.weights });
                setBaseScores(JSON.parse(JSON.stringify(editingScenario.baseScores)));
            } else {
                setName('');
                setContext('');
                setWeights({ ...defaultWeights });
                setBaseScores(createEmptyBaseScores());
            }
            setActiveCell({ row: 0, col: 0 });
            setErrors([]);
        }
    }, [isOpen, editingScenario]);

    // Update weight for a specific player and component
    const handleWeightChange = useCallback((player: 'us' | 'china', component: keyof ComponentScores, value: number) => {
        setWeights(prev => ({
            ...prev,
            [player]: {
                ...prev[player],
                [component]: value
            }
        }));
    }, []);

    // Normalize weights to sum to 1
    const normalizeWeights = useCallback((player: 'us' | 'china') => {
        setWeights(prev => {
            const playerWeights = prev[player];
            const sum = playerWeights.E + playerWeights.D + playerWeights.T + playerWeights.S;
            if (sum === 0) return prev;

            return {
                ...prev,
                [player]: {
                    E: playerWeights.E / sum,
                    D: playerWeights.D / sum,
                    T: playerWeights.T / sum,
                    S: playerWeights.S / sum,
                }
            };
        });
    }, []);

    // Update base score for a specific cell
    const handleScoreChange = useCallback((
        rowIndex: number,
        colIndex: number,
        player: 'us' | 'china',
        component: keyof ComponentScores,
        value: number
    ) => {
        setBaseScores(prev => {
            const newScores = JSON.parse(JSON.stringify(prev));
            newScores[rowIndex][colIndex][player][component] = value;
            return newScores;
        });
    }, []);

    // Validate the scenario before saving
    const validate = (): boolean => {
        const newErrors: string[] = [];

        if (!name.trim()) {
            newErrors.push('Scenario name is required');
        }

        // Check weights sum to approximately 1
        const usSum = weights.us.E + weights.us.D + weights.us.T + weights.us.S;
        const chinaSum = weights.china.E + weights.china.D + weights.china.T + weights.china.S;

        if (Math.abs(usSum - 1) > 0.01) {
            newErrors.push(`US weights sum to ${(usSum * 100).toFixed(0)}%, should be 100%`);
        }
        if (Math.abs(chinaSum - 1) > 0.01) {
            newErrors.push(`China weights sum to ${(chinaSum * 100).toFixed(0)}%, should be 100%`);
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    // Handle save
    const handleSave = () => {
        if (!validate()) return;

        const scenario: CustomScenario = {
            id: editingScenario?.id || generateId(),
            name: name.trim(),
            context: context.trim() || `Custom scenario: ${name.trim()}`,
            weights,
            baseScores,
            createdAt: editingScenario?.createdAt || Date.now(),
        };

        onSave(scenario);
        onClose();
    };

    // Copy scores from another cell
    const copyFromCell = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        if (fromRow === toRow && fromCol === toCol) return;

        setBaseScores(prev => {
            const newScores = JSON.parse(JSON.stringify(prev));
            newScores[toRow][toCol] = JSON.parse(JSON.stringify(prev[fromRow][fromCol]));
            return newScores;
        });
    };

    if (!isOpen) return null;

    const usWeightSum = weights.us.E + weights.us.D + weights.us.T + weights.us.S;
    const chinaWeightSum = weights.china.E + weights.china.D + weights.china.T + weights.china.S;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content custom-scenario-builder" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editingScenario ? 'Edit Custom Scenario' : 'Create Custom Scenario'}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>

                <div className="modal-body">
                    {/* Basic Info */}
                    <section className="builder-section">
                        <h3>Basic Information</h3>
                        <div className="form-group">
                            <label htmlFor="scenario-name">Scenario Name *</label>
                            <input
                                id="scenario-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Currency War"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="scenario-context">Context Description</label>
                            <textarea
                                id="scenario-context"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="Describe the scenario context..."
                                className="form-textarea"
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* Weights Configuration */}
                    <section className="builder-section">
                        <h3>Strategic Weights</h3>
                        <p className="section-help">
                            Adjust how much each factor contributes to the overall payoff. Weights should sum to 100%.
                        </p>

                        <div className="weights-container">
                            <div className="weights-column">
                                <h4 className="player-title us">
                                    United States
                                    <span className={`weight-sum ${Math.abs(usWeightSum - 1) > 0.01 ? 'invalid' : 'valid'}`}>
                                        ({(usWeightSum * 100).toFixed(0)}%)
                                    </span>
                                </h4>
                                <WeightSlider
                                    label="Economic Impact"
                                    shortLabel="Economic (E)"
                                    value={weights.us.E}
                                    onChange={(v) => handleWeightChange('us', 'E', v)}
                                    color="#3b82f6"
                                />
                                <WeightSlider
                                    label="Domestic Politics"
                                    shortLabel="Political (D)"
                                    value={weights.us.D}
                                    onChange={(v) => handleWeightChange('us', 'D', v)}
                                    color="#3b82f6"
                                />
                                <WeightSlider
                                    label="Tech Dominance"
                                    shortLabel="Tech (T)"
                                    value={weights.us.T}
                                    onChange={(v) => handleWeightChange('us', 'T', v)}
                                    color="#3b82f6"
                                />
                                <WeightSlider
                                    label="Supply Chain"
                                    shortLabel="Supply (S)"
                                    value={weights.us.S}
                                    onChange={(v) => handleWeightChange('us', 'S', v)}
                                    color="#3b82f6"
                                />
                                <button
                                    className="normalize-btn"
                                    onClick={() => normalizeWeights('us')}
                                    type="button"
                                >
                                    Normalize to 100%
                                </button>
                            </div>

                            <div className="weights-column">
                                <h4 className="player-title china">
                                    China
                                    <span className={`weight-sum ${Math.abs(chinaWeightSum - 1) > 0.01 ? 'invalid' : 'valid'}`}>
                                        ({(chinaWeightSum * 100).toFixed(0)}%)
                                    </span>
                                </h4>
                                <WeightSlider
                                    label="Economic Impact"
                                    shortLabel="Economic (E)"
                                    value={weights.china.E}
                                    onChange={(v) => handleWeightChange('china', 'E', v)}
                                    color="#ef4444"
                                />
                                <WeightSlider
                                    label="Domestic Politics"
                                    shortLabel="Political (D)"
                                    value={weights.china.D}
                                    onChange={(v) => handleWeightChange('china', 'D', v)}
                                    color="#ef4444"
                                />
                                <WeightSlider
                                    label="Tech Dominance"
                                    shortLabel="Tech (T)"
                                    value={weights.china.T}
                                    onChange={(v) => handleWeightChange('china', 'T', v)}
                                    color="#ef4444"
                                />
                                <WeightSlider
                                    label="Supply Chain"
                                    shortLabel="Supply (S)"
                                    value={weights.china.S}
                                    onChange={(v) => handleWeightChange('china', 'S', v)}
                                    color="#ef4444"
                                />
                                <button
                                    className="normalize-btn"
                                    onClick={() => normalizeWeights('china')}
                                    type="button"
                                >
                                    Normalize to 100%
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Base Scores Matrix */}
                    <section className="builder-section">
                        <h3>Base Scores Matrix</h3>
                        <p className="section-help">
                            Click a cell to edit. Scores range from -10 (worst) to +10 (best) for each component.
                        </p>

                        <div className="scores-editor">
                            {/* Mini Matrix for Cell Selection */}
                            <div className="mini-matrix">
                                <table className="mini-matrix-table">
                                    <thead>
                                        <tr>
                                            <th>US \ China</th>
                                            {strategyOptions.map(opt => (
                                                <th key={opt.key} title={opt.label}>
                                                    {opt.label.substring(0, 3)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {strategyOptions.map((usOpt, rowIndex) => (
                                            <tr key={usOpt.key}>
                                                <th title={usOpt.label}>{usOpt.label.substring(0, 3)}</th>
                                                {strategyOptions.map((chinaOpt, colIndex) => (
                                                    <td
                                                        key={chinaOpt.key}
                                                        className={`mini-cell ${activeCell?.row === rowIndex && activeCell?.col === colIndex ? 'active' : ''}`}
                                                        onClick={() => setActiveCell({ row: rowIndex, col: colIndex })}
                                                        title={`${usOpt.label} vs ${chinaOpt.label}`}
                                                    >
                                                        <span className="mini-score us">
                                                            {(baseScores[rowIndex][colIndex].us.E +
                                                              baseScores[rowIndex][colIndex].us.D +
                                                              baseScores[rowIndex][colIndex].us.T +
                                                              baseScores[rowIndex][colIndex].us.S) / 4}
                                                        </span>
                                                        <span className="mini-score china">
                                                            {(baseScores[rowIndex][colIndex].china.E +
                                                              baseScores[rowIndex][colIndex].china.D +
                                                              baseScores[rowIndex][colIndex].china.T +
                                                              baseScores[rowIndex][colIndex].china.S) / 4}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Active Cell Editor */}
                            {activeCell && (
                                <div className="active-cell-editor">
                                    <CellEditor
                                        scores={baseScores[activeCell.row][activeCell.col]}
                                        onChange={(player, component, value) =>
                                            handleScoreChange(activeCell.row, activeCell.col, player, component, value)
                                        }
                                        usStrategy={strategyOptions[activeCell.row].label}
                                        chinaStrategy={strategyOptions[activeCell.col].label}
                                    />

                                    {/* Copy from another cell */}
                                    <div className="copy-cell-section">
                                        <label>Copy scores from:</label>
                                        <select
                                            onChange={(e) => {
                                                const [row, col] = e.target.value.split('-').map(Number);
                                                if (!isNaN(row) && !isNaN(col)) {
                                                    copyFromCell(row, col, activeCell.row, activeCell.col);
                                                }
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select cell...</option>
                                            {strategyOptions.map((usOpt, row) =>
                                                strategyOptions.map((chinaOpt, col) => (
                                                    <option
                                                        key={`${row}-${col}`}
                                                        value={`${row}-${col}`}
                                                        disabled={row === activeCell.row && col === activeCell.col}
                                                    >
                                                        {usOpt.label} vs {chinaOpt.label}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="error-messages">
                            {errors.map((error, index) => (
                                <p key={index} className="error-message">{error}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {editingScenario ? 'Save Changes' : 'Create Scenario'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomScenarioBuilder;
