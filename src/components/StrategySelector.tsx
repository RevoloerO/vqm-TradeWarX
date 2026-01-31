import type { StrategySelectorProps } from '../types';

function StrategySelector({
    usStrategy,
    setUsStrategy,
    chinaStrategy,
    setChinaStrategy,
    strategyOptions
}: StrategySelectorProps): JSX.Element {
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
                            aria-pressed={usStrategy === option.key}
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
                            aria-pressed={chinaStrategy === option.key}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StrategySelector;
