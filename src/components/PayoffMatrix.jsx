import React from 'react';

function PayoffMatrix({ matrix, isNashEquilibrium, isParetoOptimal, handleStrategySelection }) {
    return (
        <div className="card">
            <h3>Payoff Matrix</h3>
            <table className="matrix-table">
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`matrix-cell ${
                                        isNashEquilibrium(matrix, rowIndex, colIndex) ? 'nash' : ''
                                    } ${
                                        isParetoOptimal(matrix, rowIndex, colIndex) ? 'pareto' : ''
                                    }`}
                                    onClick={() => handleStrategySelection(rowIndex, colIndex)}
                                >
                                    US: {cell.us}, China: {cell.china}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PayoffMatrix;
