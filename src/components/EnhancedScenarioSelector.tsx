import type { EnhancedScenarioSelectorProps, CustomScenario } from '../types';

function EnhancedScenarioSelector({
    scenario,
    setScenario,
    scenarioOptions,
    scenarioContext,
    customScenarios,
    onCreateCustom,
    onEditCustom,
    onDeleteCustom,
    isCustomScenario
}: EnhancedScenarioSelectorProps): JSX.Element {
    const handleDelete = (e: React.MouseEvent, customScenario: CustomScenario) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${customScenario.name}"?`)) {
            onDeleteCustom(customScenario.id);
        }
    };

    const handleEdit = (e: React.MouseEvent, customScenario: CustomScenario) => {
        e.stopPropagation();
        onEditCustom(customScenario);
    };

    return (
        <div className="card">
            <h3>Select Conflict Scenario</h3>

            <div className="scenario-selector-enhanced">
                {/* Built-in Scenarios */}
                <div className="scenario-group">
                    <h4 className="scenario-group-title">Built-in Scenarios</h4>
                    <div className="scenario-options">
                        {scenarioOptions.map((option) => (
                            <button
                                key={option}
                                className={`scenario-option ${scenario === option && !isCustomScenario ? 'selected' : ''}`}
                                onClick={() => setScenario(option)}
                            >
                                <span className="scenario-name">{option}</span>
                                <span className="scenario-badge builtin">Built-in</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Scenarios */}
                <div className="scenario-group">
                    <h4 className="scenario-group-title">
                        Custom Scenarios
                        <button
                            className="create-custom-btn"
                            onClick={onCreateCustom}
                            aria-label="Create new custom scenario"
                        >
                            + New
                        </button>
                    </h4>

                    {customScenarios.length === 0 ? (
                        <div className="no-custom-scenarios">
                            <p>No custom scenarios yet.</p>
                            <button className="create-first-btn" onClick={onCreateCustom}>
                                Create your first scenario
                            </button>
                        </div>
                    ) : (
                        <div className="scenario-options custom">
                            {customScenarios.map((customScenario) => (
                                <div
                                    key={customScenario.id}
                                    className={`scenario-option custom ${scenario === customScenario.id && isCustomScenario ? 'selected' : ''}`}
                                    onClick={() => setScenario(customScenario.id)}
                                >
                                    <div className="scenario-option-content">
                                        <span className="scenario-name">{customScenario.name}</span>
                                        <span className="scenario-badge custom">Custom</span>
                                    </div>
                                    <div className="scenario-actions">
                                        <button
                                            className="scenario-action edit"
                                            onClick={(e) => handleEdit(e, customScenario)}
                                            aria-label={`Edit ${customScenario.name}`}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="scenario-action delete"
                                            onClick={(e) => handleDelete(e, customScenario)}
                                            aria-label={`Delete ${customScenario.name}`}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Context Display */}
            {scenarioContext && (
                <div className="context">
                    <p>{scenarioContext}</p>
                    {isCustomScenario && (
                        <span className="custom-indicator">Custom Scenario</span>
                    )}
                </div>
            )}
        </div>
    );
}

export default EnhancedScenarioSelector;
