import { useState, useCallback } from 'react';
import type { InteractivePayoffMatrixProps, ScenarioScores, PayoffCell } from '../types';

// Mini bar chart for visualizing component scores
interface MiniBarChartProps {
    usScores: { E: number; D: number; T: number; S: number };
    chinaScores: { E: number; D: number; T: number; S: number };
}

function MiniBarChart({ usScores, chinaScores }: MiniBarChartProps): JSX.Element {
    const components = ['E', 'D', 'T', 'S'] as const;
    const maxVal = 10;

    return (
        <div className="mini-bar-chart">
            {components.map(comp => {
                const usVal = usScores[comp];
                const chinaVal = chinaScores[comp];
                const usWidth = Math.abs(usVal) / maxVal * 50;
                const chinaWidth = Math.abs(chinaVal) / maxVal * 50;

                return (
                    <div key={comp} className="mini-bar-row">
                        <span className="mini-bar-label">{comp}</span>
                        <div className="mini-bar-container">
                            <div
                                className={`mini-bar us ${usVal >= 0 ? 'positive' : 'negative'}`}
                                style={{ width: `${usWidth}%`, left: usVal >= 0 ? '50%' : `${50 - usWidth}%` }}
                            />
                            <div
                                className={`mini-bar china ${chinaVal >= 0 ? 'positive' : 'negative'}`}
                                style={{ width: `${chinaWidth}%`, left: chinaVal >= 0 ? '50%' : `${50 - chinaWidth}%` }}
                            />
                            <div className="mini-bar-center" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Best response indicator
interface BestResponseIndicatorProps {
    matrix: PayoffCell[][];
    rowIndex: number;
    colIndex: number;
}

function BestResponseIndicator({ matrix, rowIndex, colIndex }: BestResponseIndicatorProps): JSX.Element | null {
    // Check if this is US's best response given China's strategy (column)
    const isBestForUS = matrix.every((row, i) => matrix[i][colIndex].us <= matrix[rowIndex][colIndex].us);

    // Check if this is China's best response given US's strategy (row)
    const isBestForChina = matrix[rowIndex].every((cell) => cell.china <= matrix[rowIndex][colIndex].china);

    if (!isBestForUS && !isBestForChina) return null;

    return (
        <div className="best-response-indicators">
            {isBestForUS && (
                <span className="best-response us" title="Best response for US">
                    ★
                </span>
            )}
            {isBestForChina && (
                <span className="best-response china" title="Best response for China">
                    ★
                </span>
            )}
        </div>
    );
}

function PayoffMatrix({
    payoffMatrix,
    baseScores,
    isNashEquilibrium,
    isParetoOptimal,
    strategyOptions,
    usStrategy,
    chinaStrategy,
    onCellClick,
    highlightedCells = [],
    showMiniCharts = false
}: InteractivePayoffMatrixProps): JSX.Element {
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
    const [comparisonCell, setComparisonCell] = useState<{ row: number; col: number } | null>(null);

    if (!payoffMatrix || payoffMatrix.length === 0) {
        return <div className="card"><p>Please select a scenario to view the payoff matrix.</p></div>;
    }

    const usIndex = strategyOptions.findIndex(o => o.key === usStrategy);
    const chinaIndex = strategyOptions.findIndex(o => o.key === chinaStrategy);

    const handleCellClick = useCallback((rowIndex: number, colIndex: number, e: React.MouseEvent) => {
        // Ctrl/Cmd + click for comparison mode
        if (e.ctrlKey || e.metaKey) {
            if (comparisonCell?.row === rowIndex && comparisonCell?.col === colIndex) {
                setComparisonCell(null);
            } else {
                setComparisonCell({ row: rowIndex, col: colIndex });
            }
            return;
        }

        // Normal click to select strategies
        if (onCellClick) {
            onCellClick(strategyOptions[rowIndex].key, strategyOptions[colIndex].key);
        }
    }, [onCellClick, strategyOptions, comparisonCell]);

    const renderTooltipContent = (scores: ScenarioScores, rowIndex: number, colIndex: number): JSX.Element => {
        const currentPayoff = payoffMatrix[rowIndex][colIndex];

        // If comparison mode is active and this isn't the comparison cell
        const showComparison = comparisonCell &&
            (comparisonCell.row !== rowIndex || comparisonCell.col !== colIndex);

        const compPayoff = showComparison ? payoffMatrix[comparisonCell.row][comparisonCell.col] : null;
        const compScores = showComparison ? baseScores[comparisonCell.row][comparisonCell.col] : null;

        return (
            <div className="tooltip-content-enhanced">
                <div className="tooltip-header">Base Scores</div>
                <div className="tooltip-grid">
                    <strong>Component</strong><strong>US</strong><strong>China</strong>
                    <strong>Eco. Impact (E)</strong>
                    <span className={compScores ? (scores.us.E > compScores.us.E ? 'better' : scores.us.E < compScores.us.E ? 'worse' : '') : ''}>
                        {scores.us.E}
                    </span>
                    <span className={compScores ? (scores.china.E > compScores.china.E ? 'better' : scores.china.E < compScores.china.E ? 'worse' : '') : ''}>
                        {scores.china.E}
                    </span>
                    <strong>Dom. Politics (D)</strong>
                    <span className={compScores ? (scores.us.D > compScores.us.D ? 'better' : scores.us.D < compScores.us.D ? 'worse' : '') : ''}>
                        {scores.us.D}
                    </span>
                    <span className={compScores ? (scores.china.D > compScores.china.D ? 'better' : scores.china.D < compScores.china.D ? 'worse' : '') : ''}>
                        {scores.china.D}
                    </span>
                    <strong>Tech Dom. (T)</strong>
                    <span className={compScores ? (scores.us.T > compScores.us.T ? 'better' : scores.us.T < compScores.us.T ? 'worse' : '') : ''}>
                        {scores.us.T}
                    </span>
                    <span className={compScores ? (scores.china.T > compScores.china.T ? 'better' : scores.china.T < compScores.china.T ? 'worse' : '') : ''}>
                        {scores.china.T}
                    </span>
                    <strong>Supply Chain (S)</strong>
                    <span className={compScores ? (scores.us.S > compScores.us.S ? 'better' : scores.us.S < compScores.us.S ? 'worse' : '') : ''}>
                        {scores.us.S}
                    </span>
                    <span className={compScores ? (scores.china.S > compScores.china.S ? 'better' : scores.china.S < compScores.china.S ? 'worse' : '') : ''}>
                        {scores.china.S}
                    </span>
                </div>

                {showComparison && compPayoff && (
                    <div className="tooltip-comparison">
                        <div className="comparison-header">vs Selected Cell</div>
                        <div className="comparison-row">
                            <span>US Δ:</span>
                            <span className={currentPayoff.us > compPayoff.us ? 'better' : currentPayoff.us < compPayoff.us ? 'worse' : ''}>
                                {currentPayoff.us > compPayoff.us ? '+' : ''}{(currentPayoff.us - compPayoff.us).toFixed(2)}
                            </span>
                        </div>
                        <div className="comparison-row">
                            <span>China Δ:</span>
                            <span className={currentPayoff.china > compPayoff.china ? 'better' : currentPayoff.china < compPayoff.china ? 'worse' : ''}>
                                {currentPayoff.china > compPayoff.china ? '+' : ''}{(currentPayoff.china - compPayoff.china).toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="tooltip-hint">
                    {onCellClick && <span>Click to select • </span>}
                    <span>Ctrl+Click to compare</span>
                </div>
            </div>
        );
    };

    const isHighlighted = (row: number, col: number): boolean => {
        return highlightedCells.some(cell => cell.row === row && cell.col === col);
    };

    return (
        <div className="card">
            <h3>Payoff Matrix (Calculated Utility)</h3>
            <div className="matrix-legend" aria-label="Matrix legend">
                <span className="legend-item">
                    <span className="legend-color nash" aria-hidden="true"></span>
                    Nash Equilibrium
                </span>
                <span className="legend-item">
                    <span className="legend-color pareto" aria-hidden="true"></span>
                    Pareto Optimal
                </span>
                <span className="legend-item">
                    <span className="legend-color selected" aria-hidden="true"></span>
                    Selected
                </span>
                {comparisonCell && (
                    <span className="legend-item">
                        <span className="legend-color comparison" aria-hidden="true"></span>
                        Comparing
                        <button
                            className="clear-comparison"
                            onClick={() => setComparisonCell(null)}
                            aria-label="Clear comparison"
                        >
                            ×
                        </button>
                    </span>
                )}
            </div>
            <div className="table-container">
                <table className="matrix-table interactive" role="grid" aria-label="Interactive payoff matrix">
                    <thead>
                        <tr>
                            <th scope="col">US \ China</th>
                            {strategyOptions.map(opt => (
                                <th key={opt.key} scope="col">{opt.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {payoffMatrix.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th scope="row">{strategyOptions[rowIndex].label}</th>
                                {row.map((cell, colIndex) => {
                                    const isSelected = rowIndex === usIndex && colIndex === chinaIndex;
                                    const isNash = isNashEquilibrium(payoffMatrix, rowIndex, colIndex);
                                    const isPareto = isParetoOptimal(payoffMatrix, rowIndex, colIndex);
                                    const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                                    const isComparing = comparisonCell?.row === rowIndex && comparisonCell?.col === colIndex;
                                    const isCellHighlighted = isHighlighted(rowIndex, colIndex);

                                    let cellClasses = 'matrix-cell interactive';
                                    if (isSelected) cellClasses += ' selected';
                                    if (isNash) cellClasses += ' nash';
                                    if (isPareto) cellClasses += ' pareto';
                                    if (isHovered) cellClasses += ' hovered';
                                    if (isComparing) cellClasses += ' comparing';
                                    if (isCellHighlighted) cellClasses += ' highlighted';
                                    if (onCellClick) cellClasses += ' clickable';

                                    return (
                                        <td
                                            key={colIndex}
                                            className={cellClasses}
                                            onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                                            onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                                            onMouseLeave={() => setHoveredCell(null)}
                                            aria-label={`US: ${cell.us}, China: ${cell.china}${isNash ? ', Nash Equilibrium' : ''}${isPareto ? ', Pareto Optimal' : ''}`}
                                            tabIndex={onCellClick ? 0 : -1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleCellClick(rowIndex, colIndex, e as unknown as React.MouseEvent);
                                                }
                                            }}
                                        >
                                            <div className="tooltip">
                                                {renderTooltipContent(baseScores[rowIndex][colIndex], rowIndex, colIndex)}
                                            </div>

                                            <BestResponseIndicator
                                                matrix={payoffMatrix}
                                                rowIndex={rowIndex}
                                                colIndex={colIndex}
                                            />

                                            <div className="cell-payoffs">
                                                <span className="payoff us">US: {cell.us}</span>
                                                <span className="payoff china">China: {cell.china}</span>
                                            </div>

                                            {showMiniCharts && (
                                                <MiniBarChart
                                                    usScores={baseScores[rowIndex][colIndex].us}
                                                    chinaScores={baseScores[rowIndex][colIndex].china}
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Matrix Controls */}
            <div className="matrix-controls">
                <label className="matrix-control-item">
                    <input
                        type="checkbox"
                        checked={showMiniCharts}
                        onChange={() => {/* This will be controlled by parent */}}
                        disabled
                    />
                    <span>Show component breakdown (coming soon)</span>
                </label>
            </div>
        </div>
    );
}

export default PayoffMatrix;
