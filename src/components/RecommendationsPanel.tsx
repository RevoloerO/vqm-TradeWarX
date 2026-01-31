import { useState, useEffect } from 'react';
import type { RecommendationsPanelProps } from '../types';

/**
 * Generate strategic recommendations based on the selected scenario and strategies.
 * Analysis is based on the game theory model from "The Bellicose Duopoly" paper.
 */
function getRecommendations(
    scenario: string | null,
    usStrategy: string | null,
    chinaStrategy: string | null
): string[] {
    if (!scenario || !usStrategy || !chinaStrategy) {
        return ["Select a scenario and strategies for analysis."];
    }

    // Mutual escalation - highest risk scenario
    if (usStrategy.includes('Escalate') && chinaStrategy.includes('Escalate')) {
        return [
            "High-level escalation risks 'Mutually Assured Economic Destruction'.",
            "This path is highly unstable and likely to cause severe economic harm to both players, as seen in the 2025 tariff brinkmanship.",
            "Consider initiating negotiations to find an off-ramp and de-escalate to a more manageable, though still hostile, 'Unstable Détente'."
        ];
    }

    // Mutual de-escalation - optimal but politically costly
    if (usStrategy === 'De-escalate' && chinaStrategy === 'De-escalate') {
        return [
            "Mutual de-escalation leads to a 'Grand Bargain' scenario with the highest economic payoffs.",
            "However, the paper notes this is politically costly for both leaders, who may be seen as 'caving' to the other side.",
            "This outcome, while economically optimal, is considered politically infeasible in the current climate of deep mistrust."
        ];
    }

    // Asymmetric escalation/status quo - unstable détente
    if ((usStrategy.includes('Escalate') && chinaStrategy.includes('StatusQuo')) ||
        (usStrategy.includes('StatusQuo') && chinaStrategy.includes('Escalate'))) {
        return [
            "This dynamic reflects the 'Unstable Détente' equilibrium.",
            "One side pushes, the other holds, leading to periods of tension followed by potential negotiation.",
            "This state of perpetual, managed hostility avoids total disaster but creates a permanent 'uncertainty tax' on the economy."
        ];
    }

    // Default analysis
    return [
        "Analyze the payoff matrix to identify the rational response. The most likely real-world outcome is a cycle of escalation and de-escalation ('Unstable Détente')."
    ];
}

function RecommendationsPanel({
    scenario,
    usStrategy,
    chinaStrategy
}: RecommendationsPanelProps): JSX.Element | null {
    const [recommendations, setRecommendations] = useState<string[]>([]);

    useEffect(() => {
        setRecommendations(getRecommendations(scenario, usStrategy, chinaStrategy));
    }, [scenario, usStrategy, chinaStrategy]);

    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="card recommendations-panel">
            <h3>Strategic Analysis & Recommendations</h3>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );
}

export default RecommendationsPanel;
