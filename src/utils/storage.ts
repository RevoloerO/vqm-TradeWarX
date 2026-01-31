import type { CustomScenario } from '../types';

const STORAGE_KEY = 'tradewarx-custom-scenarios';

/**
 * Load custom scenarios from localStorage.
 * Returns an empty array if no scenarios exist or on error.
 */
export const loadCustomScenarios = (): CustomScenario[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const scenarios = JSON.parse(stored);

        // Validate the structure
        if (!Array.isArray(scenarios)) return [];

        return scenarios.filter(isValidCustomScenario);
    } catch (error) {
        console.error('Failed to load custom scenarios:', error);
        return [];
    }
};

/**
 * Save custom scenarios to localStorage.
 */
export const saveCustomScenarios = (scenarios: CustomScenario[]): boolean => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
        return true;
    } catch (error) {
        console.error('Failed to save custom scenarios:', error);
        return false;
    }
};

/**
 * Add a new custom scenario or update an existing one.
 */
export const saveCustomScenario = (scenario: CustomScenario): CustomScenario[] => {
    const scenarios = loadCustomScenarios();
    const existingIndex = scenarios.findIndex(s => s.id === scenario.id);

    if (existingIndex >= 0) {
        scenarios[existingIndex] = scenario;
    } else {
        scenarios.push(scenario);
    }

    saveCustomScenarios(scenarios);
    return scenarios;
};

/**
 * Delete a custom scenario by ID.
 */
export const deleteCustomScenario = (id: string): CustomScenario[] => {
    const scenarios = loadCustomScenarios();
    const filtered = scenarios.filter(s => s.id !== id);
    saveCustomScenarios(filtered);
    return filtered;
};

/**
 * Validate that an object is a valid CustomScenario.
 */
const isValidCustomScenario = (obj: unknown): obj is CustomScenario => {
    if (!obj || typeof obj !== 'object') return false;

    const scenario = obj as Record<string, unknown>;

    return (
        typeof scenario.id === 'string' &&
        typeof scenario.name === 'string' &&
        typeof scenario.context === 'string' &&
        typeof scenario.createdAt === 'number' &&
        isValidWeights(scenario.weights) &&
        isValidBaseScores(scenario.baseScores)
    );
};

const isValidWeights = (weights: unknown): boolean => {
    if (!weights || typeof weights !== 'object') return false;

    const w = weights as Record<string, unknown>;

    return (
        isValidComponentScores(w.us) &&
        isValidComponentScores(w.china)
    );
};

const isValidComponentScores = (scores: unknown): boolean => {
    if (!scores || typeof scores !== 'object') return false;

    const s = scores as Record<string, unknown>;

    return (
        typeof s.E === 'number' &&
        typeof s.D === 'number' &&
        typeof s.T === 'number' &&
        typeof s.S === 'number'
    );
};

const isValidBaseScores = (baseScores: unknown): boolean => {
    if (!Array.isArray(baseScores)) return false;
    if (baseScores.length !== 4) return false;

    return baseScores.every(row => {
        if (!Array.isArray(row)) return false;
        if (row.length !== 4) return false;

        return row.every(cell => {
            if (!cell || typeof cell !== 'object') return false;
            return isValidComponentScores(cell.us) && isValidComponentScores(cell.china);
        });
    });
};

/**
 * Export scenarios as JSON for backup/sharing.
 */
export const exportScenarios = (scenarios: CustomScenario[]): string => {
    return JSON.stringify(scenarios, null, 2);
};

/**
 * Import scenarios from JSON string.
 * Returns the imported scenarios or null on error.
 */
export const importScenarios = (jsonString: string): CustomScenario[] | null => {
    try {
        const parsed = JSON.parse(jsonString);

        if (!Array.isArray(parsed)) return null;

        const validScenarios = parsed.filter(isValidCustomScenario);

        if (validScenarios.length === 0) return null;

        return validScenarios;
    } catch {
        return null;
    }
};
