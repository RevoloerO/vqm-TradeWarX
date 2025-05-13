import React from 'react';

function RecommendationsPanel({ recommendations }) {
    return (
        <div className="card">
            <h3>Recommendations</h3>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );
}

export default RecommendationsPanel;
