import type { GlossaryPanelProps } from '../types';

function GlossaryPanel({ glossaryTerms }: GlossaryPanelProps): JSX.Element {
    return (
        <div className="card">
            <h3>Glossary</h3>
            <ul className="glossary-list">
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
