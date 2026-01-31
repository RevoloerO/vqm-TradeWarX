import type { ScenarioSelectorProps } from '../types';

function ScenarioSelector({
    scenario,
    setScenario,
    scenarioOptions,
    scenarioContext
}: ScenarioSelectorProps): JSX.Element {
    return (
        <div className="card">
            <h3>Select Conflict Scenario</h3>
            <select
                className="dropdown"
                value={scenario || ''}
                onChange={(e) => setScenario(e.target.value)}
                aria-label="Select a conflict scenario"
            >
                <option value="" disabled>Select a scenario...</option>
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
