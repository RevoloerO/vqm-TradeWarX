import React from 'react';

function GlossaryPanel({ glossaryTerms }) {
    return (
        <div className="card">
            <h3>Glossary</h3>
            <ul>
                {glossaryTerms.map((entry, index) => (
                    <li key={index}>
                        <strong>{entry.term}:</strong> {entry.definition}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GlossaryPanel;
