import React from 'react';

function StrategySelector({ usStrategy, setUsStrategy, chinaStrategy, setChinaStrategy, strategyOptions }) {
    return (
        <div className="card">
            <h3>Select Strategies</h3>
            <div className="strategy-group">
                <div>
                    <h4>U.S. Strategy</h4>
                    {strategyOptions.map((option) => (
                        <button
                            key={option}
                            className={`strategy-button ${usStrategy === option ? 'selected' : ''}`}
                            onClick={() => setUsStrategy(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div>
                    <h4>China Strategy</h4>
                    {strategyOptions.map((option) => (
                        <button
                            key={option}
                            className={`strategy-button ${chinaStrategy === option ? 'selected' : ''}`}
                            onClick={() => setChinaStrategy(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StrategySelector;
