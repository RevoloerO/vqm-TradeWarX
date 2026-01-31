function MethodologyPanel(): JSX.Element {
    return (
        <div className="card methodology-section">
            <h3>Model Methodology (Based on "The Bellicose Duopoly")</h3>
            <p>
                This simulation implements the game theory model from the research paper.
                The outcome payoffs are not arbitrary; they are calculated using a multi-attribute
                utility function for each nation.
            </p>
            <p>
                <strong>Payoff Formula:</strong> Payoff(P) = w<sub>E</sub> &times; E + w<sub>D</sub> &times; D + w<sub>T</sub> &times; T + w<sub>S</sub> &times; S
            </p>
            <ul>
                <li><strong>E (Economic Impact):</strong> Change in GDP, inflation, and key sector health.</li>
                <li><strong>D (Domestic Political Impact):</strong> Leadership approval, media narrative, and support from key constituencies.</li>
                <li><strong>T (Technological Dominance):</strong> Progress in the race for technological supremacy and self-sufficiency.</li>
                <li><strong>S (Supply Chain Security):</strong> Access to critical materials (e.g., rare earths, semiconductors).</li>
            </ul>
            <p>
                <strong>Strategic Weights (w):</strong> The model uses the specific weights assigned in the paper,
                reflecting each nation's strategic priorities:
            </p>
            <ul>
                <li><strong>United States:</strong> Economic (30%), Political (35%), Tech (25%), Supply Chain (10%).</li>
                <li><strong>China:</strong> Economic (40%), Political (30%), Tech (20%), Supply Chain (10%).</li>
            </ul>
            <p>
                For each scenario, the underlying scores (-10 to +10 for each component) are estimated based on the
                paper's qualitative analysis. You can hover over any cell in the payoff matrix to see the score breakdown.
                This model aims to simulate the complex, multi-faceted decision-making of state leaders as described in the research.
            </p>
        </div>
    );
}

export default MethodologyPanel;
