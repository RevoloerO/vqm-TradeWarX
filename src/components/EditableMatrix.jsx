import React from 'react';

function EditableMatrix({ matrix, updateMatrixCell, prepareChartData, setChartData, setRecommendations, usStrategy, chinaStrategy }) {
    return (
        <div className="card">
            <h3>Edit Payoff Matrix</h3>
            <table className="matrix-table">
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>
                                    <div>
                                        <label>US:</label>
                                        <input
                                            type="number"
                                            value={cell.us}
                                            onChange={(e) =>
                                                updateMatrixCell(rowIndex, colIndex, 'us', parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>China:</label>
                                        <input
                                            type="number"
                                            value={cell.china}
                                            onChange={(e) =>
                                                updateMatrixCell(rowIndex, colIndex, 'china', parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-group" style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <button
                    className="update-button"
                    onClick={() => {
                        const updatedChartData = prepareChartData(matrix, { usStrategy, chinaStrategy });
                        setChartData(updatedChartData);
                    }}
                >
                    Update Strategy Frequency and Outcome Trends
                </button>
                <button
                    className="update-button"
                    onClick={() => {
                        const updatedRecommendations = [];
                        if (usStrategy === 'Aggressive' && chinaStrategy === 'Passive') {
                            updatedRecommendations.push('The U.S. may dominate in the short term, but risks long-term retaliation.');
                        }
                        if (usStrategy === 'Moderate' && chinaStrategy === 'Moderate') {
                            updatedRecommendations.push('Both nations may achieve balanced outcomes with minimal conflict.');
                        }
                        if (usStrategy === 'Passive' && chinaStrategy === 'Aggressive') {
                            updatedRecommendations.push('China may gain an upper hand, but risks overextension.');
                        }
                        setRecommendations(updatedRecommendations);
                    }}
                >
                    Update Payoff Distribution
                </button>
            </div>
        </div>
    );
}

export default EditableMatrix;
