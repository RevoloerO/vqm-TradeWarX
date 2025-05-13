import React from 'react';

function ScenarioSelector({ scenario, setScenario, scenarioOptions, scenarioContext }) {
    return (
        <div className="card">
            <h3>Select Scenario</h3>
            <select
                className="dropdown"
                value={scenario || ''}
                onChange={(e) => setScenario(e.target.value)}
            >
                <option value="" disabled>Select Scenario</option>
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

export default ScenarioSelector;
