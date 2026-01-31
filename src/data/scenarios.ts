import type { Scenarios, Weights, StrategyOption, GlossaryEntry } from '../types';

/**
 * Strategic weights for each nation's utility function.
 * These reflect each nation's priorities as described in "The Bellicose Duopoly" paper.
 *
 * - E (Economic Impact): Change in GDP, inflation, and key sector health
 * - D (Domestic Political Impact): Leadership approval, media narrative, constituency support
 * - T (Technological Dominance): Progress in tech supremacy and self-sufficiency
 * - S (Supply Chain Security): Access to critical materials (rare earths, semiconductors)
 */
export const weights: Weights = {
    us: { E: 0.30, D: 0.35, T: 0.25, S: 0.10 },
    china: { E: 0.40, D: 0.30, T: 0.20, S: 0.10 },
};

/**
 * Available strategy options for both players.
 * Each strategy represents a different posture in the trade conflict.
 */
export const strategyOptions: StrategyOption[] = [
    { key: 'De-escalate', label: 'De-escalate' },
    { key: 'StatusQuo', label: 'Status Quo' },
    { key: 'EscalateSymmetrically', label: 'Escalate Symmetrically' },
    { key: 'EscalateAsymmetrically', label: 'Escalate Asymmetrically' },
];

/**
 * Game theory glossary terms for educational purposes.
 */
export const glossaryTerms: GlossaryEntry[] = [
    {
        term: 'Nash Equilibrium',
        definition: "A stable outcome where no player can benefit by changing their strategy unilaterally, assuming the other player's strategy remains constant."
    },
    {
        term: 'Pareto Optimality',
        definition: 'An outcome where no player can be made better off without making at least one other player worse off. It represents the set of most efficient outcomes.'
    },
    {
        term: 'Unstable Détente',
        definition: "The predicted equilibrium from the paper; a cycle of escalation and de-escalation where conflict is managed but never resolved, creating persistent uncertainty."
    },
    {
        term: 'Dual Circulation Strategy',
        definition: "China's strategy to reorient its economy by boosting domestic consumption and achieving technological self-sufficiency to reduce vulnerability to external pressure."
    },
];

/**
 * Scenario data containing context descriptions and base scores for each strategy combination.
 * Base scores range from -10 to +10 for each component (E, D, T, S).
 *
 * Matrix structure: baseScores[usStrategyIndex][chinaStrategyIndex]
 * Strategy indices: 0=De-escalate, 1=StatusQuo, 2=EscalateSymmetrically, 3=EscalateAsymmetrically
 */
export const scenarios: Scenarios = {
    "Tech War": {
        context: "A direct confrontation focused on technological dominance. The US employs export controls on semiconductors and AI, while China leverages its control over tech manufacturing and supply chains.",
        baseScores: [
            // US De-escalate
            [
                { us: { E: 5, D: -6, T: -5, S: 3 }, china: { E: 5, D: -6, T: 2, S: 3 } },      // China De-escalate
                { us: { E: 3, D: -4, T: -7, S: 1 }, china: { E: 6, D: 4, T: 5, S: 4 } },      // China StatusQuo
                { us: { E: -2, D: -5, T: -8, S: -4 }, china: { E: 3, D: 6, T: 7, S: 2 } },    // China EscalateSymmetrically
                { us: { E: -5, D: -7, T: -10, S: -8 }, china: { E: 0, D: 8, T: 8, S: -2 } }   // China EscalateAsymmetrically
            ],
            // US StatusQuo
            [
                { us: { E: 6, D: 4, T: 4, S: 2 }, china: { E: 2, D: -3, T: -4, S: 0 } },      // China De-escalate
                { us: { E: 2, D: 2, T: 2, S: 0 }, china: { E: 2, D: 2, T: 2, S: 0 } },        // China StatusQuo
                { us: { E: -3, D: 3, T: 0, S: -5 }, china: { E: -2, D: 5, T: 4, S: -3 } },    // China EscalateSymmetrically
                { us: { E: -6, D: 1, T: -2, S: -9 }, china: { E: -4, D: 7, T: 6, S: -5 } }    // China EscalateAsymmetrically
            ],
            // US EscalateSymmetrically
            [
                { us: { E: 4, D: 6, T: 6, S: 5 }, china: { E: -4, D: -4, T: -6, S: -5 } },    // China De-escalate
                { us: { E: -1, D: 5, T: 5, S: -2 }, china: { E: -3, D: 3, T: -3, S: -2 } },   // China StatusQuo
                { us: { E: -5, D: 0, T: -4, S: -7 }, china: { E: -6, D: 0, T: -5, S: -6 } },  // China EscalateSymmetrically
                { us: { E: -8, D: -2, T: -6, S: -10 }, china: { E: -7, D: -1, T: -4, S: -8 } }// China EscalateAsymmetrically
            ],
            // US EscalateAsymmetrically
            [
                { us: { E: 2, D: 8, T: 8, S: 3 }, china: { E: -7, D: -5, T: -8, S: -7 } },    // China De-escalate
                { us: { E: 0, D: 7, T: 7, S: -1 }, china: { E: -5, D: 0, T: -6, S: -4 } },    // China StatusQuo
                { us: { E: -4, D: 2, T: 3, S: -6 }, china: { E: -8, D: -2, T: -7, S: -8 } },  // China EscalateSymmetrically
                { us: { E: -7, D: -4, T: -5, S: -9 }, china: { E: -10, D: -6, T: -10, S: -10 } }// China EscalateAsymmetrically
            ]
        ]
    },
    "Trade & Tariffs": {
        context: "A broad-based conflict using tariffs as the primary weapon, justified by trade imbalances and domestic issues (e.g., fentanyl precursors). This reflects the tit-for-tat escalation cycles.",
        baseScores: [
            // US De-escalate
            [
                { us: { E: 7, D: -7, T: 0, S: 2 }, china: { E: 7, D: -7, T: 1, S: 2 } },      // China De-escalate
                { us: { E: 4, D: -5, T: -2, S: 0 }, china: { E: 8, D: 5, T: 3, S: 4 } },      // China StatusQuo
                { us: { E: -2, D: -6, T: -3, S: -3 }, china: { E: 4, D: 7, T: 4, S: 1 } },    // China EscalateSymmetrically
                { us: { E: -4, D: -8, T: -4, S: -5 }, china: { E: 1, D: 8, T: 5, S: -2 } }    // China EscalateAsymmetrically
            ],
            // US StatusQuo
            [
                { us: { E: 8, D: 6, T: 2, S: 3 }, china: { E: 3, D: -2, T: -1, S: 0 } },      // China De-escalate
                { us: { E: 3, D: 3, T: 0, S: 0 }, china: { E: 3, D: 3, T: 0, S: 0 } },        // China StatusQuo
                { us: { E: -4, D: 4, T: -1, S: -4 }, china: { E: -3, D: 5, T: -2, S: -3 } },  // China EscalateSymmetrically
                { us: { E: -6, D: 2, T: -2, S: -6 }, china: { E: -5, D: 6, T: 2, S: -5 } }    // China EscalateAsymmetrically
            ],
            // US EscalateSymmetrically
            [
                { us: { E: 5, D: 8, T: 1, S: 4 }, china: { E: -5, D: -5, T: -3, S: -4 } },    // China De-escalate
                { us: { E: -2, D: 6, T: 0, S: -2 }, china: { E: -4, D: 4, T: -2, S: -2 } },   // China StatusQuo
                { us: { E: -7, D: 0, T: -5, S: -8 }, china: { E: -8, D: 0, T: -6, S: -8 } },  // China EscalateSymmetrically
                { us: { E: -9, D: -2, T: -6, S: -9 }, china: { E: -7, D: -1, T: -4, S: -7 } } // China EscalateAsymmetrically
            ],
            // US EscalateAsymmetrically
            [
                { us: { E: 3, D: 7, T: 5, S: 2 }, china: { E: -6, D: -6, T: -7, S: -6 } },    // China De-escalate
                { us: { E: -1, D: 5, T: 4, S: -3 }, china: { E: -5, D: 1, T: -5, S: -4 } },   // China StatusQuo
                { us: { E: -5, D: 1, T: 2, S: -7 }, china: { E: -9, D: -3, T: -8, S: -9 } },  // China EscalateSymmetrically
                { us: { E: -8, D: -5, T: -2, S: -10 }, china: { E: -10, D: -7, T: -5, S: -10 } }// China EscalateAsymmetrically
            ]
        ]
    }
};

/**
 * Get all available scenario names.
 */
export const scenarioOptions: string[] = Object.keys(scenarios);
