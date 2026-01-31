import type { ScenarioScores, Weights, PayoffCell } from '../types';

/**
 * Calculate the weighted payoff for a player given component scores and weights.
 *
 * The payoff formula from "The Bellicose Duopoly" paper:
 * Payoff(P) = w_E * E + w_D * D + w_T * T + w_S * S
 *
 * Where:
 * - E: Economic Impact (-10 to +10)
 * - D: Domestic Political Impact (-10 to +10)
 * - T: Technological Dominance (-10 to +10)
 * - S: Supply Chain Security (-10 to +10)
 *
 * @param scores - The base scores for both players in a given strategy combination
 * @param player - Which player to calculate payoff for ('us' or 'china')
 * @param currentWeights - The weight configuration for both players
 * @returns The calculated payoff as a string with 2 decimal places
 */
export const calculatePayoff = (
    scores: ScenarioScores,
    player: 'us' | 'china',
    currentWeights: Weights
): string => {
    const w = currentWeights[player];
    const playerScores = scores[player];

    const payoff =
        playerScores.E * w.E +
        playerScores.D * w.D +
        playerScores.T * w.T +
        playerScores.S * w.S;

    return payoff.toFixed(2);
};

/**
 * Check if a cell in the payoff matrix represents a Nash Equilibrium.
 *
 * A Nash Equilibrium occurs when:
 * - The US cannot improve their payoff by unilaterally changing their strategy (row)
 * - China cannot improve their payoff by unilaterally changing their strategy (column)
 *
 * @param matrix - The complete payoff matrix
 * @param row - The row index (US strategy)
 * @param col - The column index (China strategy)
 * @returns True if the cell is a Nash Equilibrium
 */
export const isNashEquilibrium = (
    matrix: PayoffCell[][],
    row: number,
    col: number
): boolean => {
    if (!matrix || !matrix[row] || !matrix[row][col]) return false;

    // Check if US can improve by changing strategy (check column)
    const usPayoff = matrix[row][col].us;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][col].us > usPayoff) return false;
    }

    // Check if China can improve by changing strategy (check row)
    const chinaPayoff = matrix[row][col].china;
    for (let j = 0; j < matrix[row].length; j++) {
        if (matrix[row][j].china > chinaPayoff) return false;
    }

    return true;
};

/**
 * Check if a cell in the payoff matrix is Pareto Optimal.
 *
 * A cell is Pareto Optimal if there is no other cell where:
 * - At least one player is better off AND
 * - No player is worse off
 *
 * In other words, you cannot make one player better off without making the other worse off.
 *
 * @param matrix - The complete payoff matrix
 * @param row - The row index (US strategy)
 * @param col - The column index (China strategy)
 * @returns True if the cell is Pareto Optimal
 */
export const isParetoOptimal = (
    matrix: PayoffCell[][],
    row: number,
    col: number
): boolean => {
    if (!matrix || !matrix[row] || !matrix[row][col]) return false;

    const { us, china } = matrix[row][col];

    // Check if any other cell Pareto-dominates this one
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const other = matrix[i][j];
            // Another cell dominates if it's better for at least one and not worse for either
            const betterForUs = other.us > us;
            const betterForChina = other.china > china;
            const notWorseForUs = other.us >= us;
            const notWorseForChina = other.china >= china;

            if ((betterForUs && notWorseForChina) || (betterForChina && notWorseForUs)) {
                return false;
            }
        }
    }

    return true;
};

/**
 * Generate the complete payoff matrix from scenario base scores.
 *
 * @param baseScores - The 4x4 matrix of base scores for each strategy combination
 * @param weights - The weight configuration for calculating payoffs
 * @returns The calculated payoff matrix
 */
export const generatePayoffMatrix = (
    baseScores: ScenarioScores[][],
    weights: Weights
): PayoffCell[][] => {
    return baseScores.map(row =>
        row.map(scores => ({
            us: parseFloat(calculatePayoff(scores, 'us', weights)),
            china: parseFloat(calculatePayoff(scores, 'china', weights)),
        }))
    );
};
